const mongoose = require("mongoose");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const CouponUsage = require("../models/CouponUsage");

const checkoutController = {
  // TẠO PHIÊN THANH TOÁN
  createCheckoutSession: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { checkoutItems, shippingAddress, paymentMethod, totalPrice, couponCode } = req.body;

      if (!checkoutItems?.length) {
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

        const variantKey = `${item.productId}-${item.size}-${item.color}`;
        const existingQty = validItems
          .filter(i => `${i.productId}-${i.size}-${i.color}` === variantKey)
          .reduce((sum, i) => sum + i.quantity, 0);

        const totalQty = existingQty + item.quantity;

        if (totalQty > product.countInStock) {
          stockErrors.push(`${product.name} (size ${item.size}, màu ${item.color}): Chỉ còn ${product.countInStock} sản phẩm (bạn chọn ${totalQty})`);
          continue;
        }

        validItems.push(item);
      }

      if (stockErrors.length) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Không đủ hàng để đặt", errors: stockErrors });
      }

      // XỬ LÝ COUPON
      let discountAmount = 0;
      let couponId = null;

      if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
        if (coupon) {
          const now = new Date();
          const alreadyUsed = await CouponUsage.findOne({ user: req.user._id, coupon: coupon._id });
          if (coupon.isActive && now >= coupon.startDate && now <= coupon.endDate && !alreadyUsed) {
            if (!coupon.minOrderValue || totalPrice >= coupon.minOrderValue) {
              discountAmount = coupon.discountType === "percent"
                ? Math.min((totalPrice * coupon.discountValue) / 100, coupon.maxDiscountValue || Infinity)
                : coupon.discountValue;
              couponId = coupon._id;
            }
          }
        }
      }

      const finalPrice = totalPrice - discountAmount;

      const newCheckout = await Checkout.create([{
        user: req.user._id,
        checkoutItems: validItems,
        shippingAddress,
        paymentMethod,
        totalPrice: finalPrice,
        coupon: couponId,
        discountAmount,
        paymentStatus: "Pending",
        isPaid: false
      }], { session });

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

      if (paymentStatus !== "Paid") return res.status(400).json({ message: `Trạng thái không hợp lệ: ${paymentStatus}` });

      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
      await checkout.save();

      return res.json(checkout);
    } catch (err) {
      return res.status(500).json({ message: "Lỗi server" });
    }
  },

  // HOÀN TẤT ĐƠN HÀNG
  finalizeCheckout: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const checkout = await Checkout.findById(req.params.id).session(session);
      if (!checkout) return res.status(404).json({ message: "Không tìm thấy đơn" });
      if (!checkout.isPaid || checkout.isFinalized) return res.status(400).json({ message: "Đơn chưa thanh toán hoặc đã hoàn tất" });

      // KIỂM TRA KHO
      for (const item of checkout.checkoutItems) {
        const product = await Product.findById(item.productId).session(session);
        if (!product || product.countInStock < item.quantity) {
          await session.abortTransaction();
          return res.status(400).json({ message: `Sản phẩm ${product?.name || item.productId} (size ${item.size}, màu ${item.color}) đã hết hàng` });
        }
      }

      // TẠO ORDER
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
        coupon: checkout.coupon,
        discountAmount: checkout.discountAmount
      }], { session });

      // TRỪ KHO VÀ TĂNG SOLD COUNT
      await Promise.all(checkout.checkoutItems.map(item =>
        Product.findByIdAndUpdate(item.productId, { $inc: { countInStock: -item.quantity, soldCount: item.quantity } }, { session })
      ));

      // TẠO COUPON USAGE
      if (checkout.coupon) {
        await CouponUsage.create({ user: checkout.user, coupon: checkout.coupon, order: finalOrder[0]._id });
        const coupon = await Coupon.findById(checkout.coupon);
        coupon.usedCount = (coupon.usedCount || 0) + 1;
        await coupon.save();
      }

      // HOÀN TẤT CHECKOUT
      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save({ session });

      // XÓA GIỎ HÀNG
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
  }
};

module.exports = checkoutController;
