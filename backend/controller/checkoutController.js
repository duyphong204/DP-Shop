// src/controllers/checkoutController.js
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");

const checkoutController = {
  // TẠO PHIÊN THANH TOÁN – KIỂM TRA KHO THEO BIẾN THỂ (productId + size + color)
  createCheckoutSession: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

      if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ message: "Không có sản phẩm để thanh toán" });
      }

      const stockErrors = [];
      const validItems = [];

      for (const item of checkoutItems) {
        const product = await Product.findById(item.productId).session(session);
        if (!product) {
          stockErrors.push(`Sản phẩm không tồn tại: ${item.productId}`);
          continue;
        }

        if (!product.isPublished || product.status !== "active") {
          stockErrors.push(`${product.name} đã ngừng kinh doanh`);
          continue;
        }

        // === TÍNH TỔNG SỐ LƯỢNG CỦA BIẾN THỂ TRONG CHECKOUT ===
        const variantKey = `${item.productId}-${item.size}-${item.color}`;
        const existingQty = validItems
          .filter(i => `${i.productId}-${i.size}-${i.color}` === variantKey)
          .reduce((sum, i) => sum + i.quantity, 0);

        const totalQty = existingQty + item.quantity;

        // === KIỂM TRA KHO CHO BIẾN THỂ ===
        if (totalQty > product.countInStock) {
          stockErrors.push(
            `${product.name} (size ${item.size}, màu ${item.color}): Chỉ còn ${product.countInStock} sản phẩm (bạn chọn ${totalQty})`
          );
          continue;
        }

        validItems.push(item);
      }

      if (stockErrors.length > 0) {
        await session.abortTransaction();
        return res.status(400).json({
          message: "Không đủ hàng để đặt",
          errors: stockErrors,
        });
      }

      if (validItems.length === 0) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Không có sản phẩm hợp lệ" });
      }

      // TẠO CHECKOUT
      const newCheckout = await Checkout.create(
        [{
          user: req.user._id,
          checkoutItems: validItems,
          shippingAddress,
          paymentMethod,
          totalPrice,
          paymentStatus: "Pending",
          isPaid: false,
        }],
        { session }
      );

      await session.commitTransaction();
      return res.status(202).json(newCheckout[0]);
    } catch (err) {
      await session.abortTransaction();
      console.error("createCheckoutSession error:", err);
      return res.status(500).json({ message: "Lỗi server", error: err.message });
    } finally {
      session.endSession();
    }
  },

  // ĐÁNH DẤU THANH TOÁN
  markAsPaid: async (req, res) => {
    try {
      const { paymentStatus, paymentDetails } = req.body;
      const checkout = await Checkout.findById(req.params.id);
      if (!checkout) return res.status(404).json({ message: "Không tìm thấy đơn" });

      if (paymentStatus === "Paid") {
        checkout.isPaid = true;
        checkout.paymentStatus = paymentStatus;
        checkout.paymentDetails = paymentDetails;
        checkout.paidAt = Date.now();
        await checkout.save();
        return res.json(checkout);
      } else {
        return res.status(400).json({ message: `Trạng thái không hợp lệ: ${paymentStatus}` });
      }
    } catch (err) {
      return res.status(500).json({ message: "Lỗi server" });
    }
  },

  // HOÀN TẤT ĐƠN HÀNG – KIỂM TRA LẠI KHO THEO BIẾN THỂ
  finalizeCheckout: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const checkout = await Checkout.findById(req.params.id).session(session);
      if (!checkout) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Không tìm thấy đơn" });
      }

      if (!checkout.isPaid || checkout.isFinalized) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Đơn chưa thanh toán hoặc đã hoàn tất" });
      }

      // === KIỂM TRA LẠI KHO CHO TỪNG BIẾN THỂ ===
      for (const item of checkout.checkoutItems) {
        const product = await Product.findById(item.productId).session(session);
        if (!product || product.countInStock < item.quantity) {
          await session.abortTransaction();
          return res.status(400).json({
            message: `Sản phẩm ${product?.name || item.productId} (size ${item.size}, màu ${item.color}) đã hết hàng`,
          });
        }
      }

      // === TẠO ORDER ===
      const finalOrder = await Order.create([{
        user: checkout.user,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        paymentStatus: "Paid",
        paymentDetails: checkout.paymentDetails,
      }], { session });

      // === TRỪ KHO ===
      for (const item of checkout.checkoutItems) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { countInStock: -item.quantity, soldCount: item.quantity } },
          { session }
        );
      }

      // === HOÀN TẤT CHECKOUT ===
      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save({ session });

      // === XÓA GIỎ HÀNG ===
      await Cart.findOneAndDelete({ user: checkout.user }).session(session);

      await session.commitTransaction();
      return res.status(201).json(finalOrder[0]);
    } catch (err) {
      await session.abortTransaction();
      console.error("finalizeCheckout error:", err);
      return res.status(500).json({ message: err.message || "Lỗi server" });
    } finally {
      session.endSession();
    }
  },
};

module.exports = checkoutController;