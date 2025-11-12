const mongoose = require("mongoose");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const CouponUsage = require("../models/CouponUsage");
const { validateCouponForUser } = require("../utils/couponService");

const checkoutController = {
  // TẠO PHIÊN THANH TOÁN
  createCheckoutSession: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const {
        checkoutItems,
        shippingAddress,
        paymentMethod,
        totalPrice: clientTotal,
        couponCode,
        couponId,
      } = req.body;

      if (!checkoutItems?.length) {
        return res
          .status(400)
          .json({ message: "Không có sản phẩm để thanh toán" });
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
          .filter((i) => `${i.productId}-${i.size}-${i.color}` === variantKey)
          .reduce((sum, i) => sum + i.quantity, 0);

        const totalQty = existingQty + item.quantity;

        if (totalQty > product.countInStock) {
          stockErrors.push(
            `${product.name} (size ${item.size}, màu ${item.color}): Chỉ còn ${product.countInStock} sản phẩm (bạn chọn ${totalQty})`
          );
          continue;
        }

        validItems.push(item);
      }

      if (stockErrors.length) {
        await session.abortTransaction();
        return res
          .status(400)
          .json({ message: "Không đủ hàng để đặt", errors: stockErrors });
      }

      const cartTotal = validItems.reduce(
        (sum, item) =>
          sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
      );

      const providedTotal = Number(clientTotal);
      if (
        !Number.isNaN(providedTotal) &&
        Math.abs(providedTotal - cartTotal) > 1000
      ) {
        console.warn(
          `Checkout total mismatch for user ${req.user._id}: client=${providedTotal}, server=${cartTotal}`
        );
      }

      if (cartTotal <= 0) {
        await session.abortTransaction();
        return res
          .status(400)
          .json({ message: "Không thể tạo đơn với tổng tiền bằng 0" });
      }

      let discountAmount = 0;
      let couponRef = null;

      if (couponCode || couponId) {
        try {
          const { coupon, discountAmount: computedDiscount } =
            await validateCouponForUser({
              couponCode,
              couponId,
              userId: req.user._id,
              orderTotal: cartTotal,
              session,
            });

          discountAmount = computedDiscount;
          couponRef = coupon._id;
        } catch (validationError) {
          await session.abortTransaction();
          return res.status(400).json({ message: validationError.message });
        }
      }

      const finalPrice = Math.max(cartTotal - discountAmount, 0);

      const newCheckout = await Checkout.create(
        [
          {
            user: req.user._id,
            checkoutItems: validItems,
            shippingAddress,
            paymentMethod,
            subtotal: cartTotal,
            totalPrice: finalPrice,
            coupon: couponRef,
            discountAmount,
            paymentStatus: "Pending",
            isPaid: false,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      const checkoutData = newCheckout[0].toObject();
      checkoutData.totalBeforeDiscount = cartTotal;
      checkoutData.discountAmount = discountAmount;
      checkoutData.coupon = couponRef;

      return res.status(202).json(checkoutData);
    } catch (err) {
      await session.abortTransaction();
      console.error("createCheckoutSession error:", err);
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    } finally {
      session.endSession();
    }
  },

  // ĐÁNH DẤU THANH TOÁN
  markAsPaid: async (req, res) => {
    try {
      const { paymentStatus, paymentDetails } = req.body;
      const checkout = await Checkout.findById(req.params.id);
      if (!checkout)
        return res.status(404).json({ message: "Không tìm thấy đơn" });

      if (paymentStatus !== "Paid")
        return res
          .status(400)
          .json({ message: `Trạng thái không hợp lệ: ${paymentStatus}` });

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
      if (!checkout)
        return res.status(404).json({ message: "Không tìm thấy đơn" });
      if (!checkout.isPaid || checkout.isFinalized)
        return res
          .status(400)
          .json({ message: "Đơn chưa thanh toán hoặc đã hoàn tất" });

      // KIỂM TRA KHO
      for (const item of checkout.checkoutItems) {
        const product = await Product.findById(item.productId).session(session);
        if (!product || product.countInStock < item.quantity) {
          await session.abortTransaction();
          return res
            .status(400)
            .json({
              message: `Sản phẩm ${product?.name || item.productId} (size ${
                item.size
              }, màu ${item.color}) đã hết hàng`,
            });
        }
      }

      // TẠO ORDER
      const finalOrder = await Order.create(
        [
          {
            user: checkout.user,
            orderItems: checkout.checkoutItems,
            shippingAddress: checkout.shippingAddress,
            paymentMethod: checkout.paymentMethod,
            subtotal: checkout.subtotal,
            totalPrice: checkout.totalPrice,
            isPaid: true,
            paidAt: checkout.paidAt,
            paymentStatus: "Paid",
            paymentDetails: checkout.paymentDetails,
            coupon: checkout.coupon,
            discountAmount: checkout.discountAmount,
          },
        ],
        { session }
      );

      // TRỪ KHO VÀ TĂNG SOLD COUNT
      await Promise.all(
        checkout.checkoutItems.map((item) =>
          Product.findByIdAndUpdate(
            item.productId,
            {
              $inc: { countInStock: -item.quantity, soldCount: item.quantity },
            },
            { session }
          )
        )
      );

      // TẠO COUPON USAGE
      if (checkout.coupon) {
        const coupon = await Coupon.findById(checkout.coupon).session(session);
        if (!coupon) {
          await session.abortTransaction();
          return res.status(400).json({ message: "Mã giảm giá không tồn tại" });
        }

        if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
          await session.abortTransaction();
          return res
            .status(400)
            .json({ message: "Mã giảm giá đã đạt số lượt sử dụng tối đa" });
        }

        const existingUsage = await CouponUsage.findOne({
          order: finalOrder[0]._id,
          coupon: checkout.coupon,
        }).session(session);

        if (!existingUsage) {
          await CouponUsage.create(
            [
              {
                user: checkout.user,
                coupon: checkout.coupon,
                order: finalOrder[0]._id,
              },
            ],
            { session }
          );

          const updateResult = await Coupon.updateOne(
            {
              _id: checkout.coupon,
              $expr: {
                $or: [
                  { $eq: ["$usageLimit", 0] },
                  { $lt: ["$usedCount", "$usageLimit"] },
                ],
              },
            },
            { $inc: { usedCount: 1 } },
            { session }
          );

          if (updateResult.modifiedCount === 0) {
            await session.abortTransaction();
            return res
              .status(400)
              .json({ message: "Mã giảm giá đã đạt số lượt sử dụng tối đa" });
          }
        }
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
  },
};

module.exports = checkoutController;
