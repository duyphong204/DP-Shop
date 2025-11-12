const mongoose = require("mongoose");
const Coupon = require("../models/Coupon");
const CouponUsage = require("../models/CouponUsage");
const Order = require("../models/Order");
const { validateCouponForUser } = require("../utils/couponService");

const validateCoupon = async (req, res) => {
  try {
    const { code, userId, totalPrice } = req.body;

    if (!code || !userId || totalPrice == null) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "UserId không hợp lệ" });
    }

    const orderTotal = Number(totalPrice);
    if (Number.isNaN(orderTotal)) {
      return res.status(400).json({ message: "Tổng giá trị đơn không hợp lệ" });
    }

    const { coupon, discountAmount } = await validateCouponForUser({
      couponCode: code,
      userId,
      orderTotal,
    });

    res.json({
      couponId: coupon._id,
      code: coupon.code,
      discountAmount,
      finalTotal: orderTotal - discountAmount,
      message: "Mã hợp lệ",
    });
  } catch (error) {
    console.error("validateCoupon error:", error);
    if (error?.isOperational) {
      return res
        .status(error.statusCode || 400)
        .json({ message: error.message });
    }
    res.status(500).json({ message: "Lỗi server" });
  }
};

const applyCoupon = async (req, res) => {
  try {
    const { couponId, userId, orderId } = req.body;

    if (!couponId || !userId || !orderId) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(couponId) ||
      !mongoose.Types.ObjectId.isValid(orderId)
    ) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }

    const order = await Order.findById(orderId);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    if (order.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền áp dụng mã cho đơn này" });
    }

    if (!order.coupon) {
      return res
        .status(400)
        .json({ message: "Đơn hàng này không sử dụng mã giảm giá" });
    }

    if (order.coupon.toString() !== couponId) {
      return res
        .status(400)
        .json({ message: "Mã giảm giá không khớp với đơn hàng" });
    }

    const existing = await CouponUsage.findOne({
      order: orderId,
      coupon: couponId,
    });
    if (existing) {
      return res.json({
        message: "Mã giảm giá đã được ghi nhận cho đơn hàng này",
      });
    }

    const userUsage = await CouponUsage.findOne({
      user: userId,
      coupon: couponId,
    });
    if (userUsage) {
      return res.status(400).json({ message: "Bạn đã sử dụng mã này rồi" });
    }

    const coupon = await Coupon.findById(couponId);
    if (!coupon)
      return res.status(404).json({ message: "Mã giảm giá không tồn tại" });

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return res
        .status(400)
        .json({ message: "Mã giảm giá đã đạt số lượt sử dụng tối đa" });
    }

    await CouponUsage.create({
      user: userId,
      coupon: coupon._id,
      order: orderId,
    });

    const updateResult = await Coupon.updateOne(
      {
        _id: couponId,
        $expr: {
          $or: [
            { $eq: ["$usageLimit", 0] },
            { $lt: ["$usedCount", "$usageLimit"] },
          ],
        },
      },
      { $inc: { usedCount: 1 } }
    );

    if (updateResult.modifiedCount === 0) {
      await CouponUsage.deleteOne({
        user: userId,
        coupon: coupon._id,
        order: orderId,
      });
      return res
        .status(400)
        .json({ message: "Mã giảm giá đã đạt số lượt sử dụng tối đa" });
    }

    res.json({ message: "Áp dụng mã giảm giá thành công" });
  } catch (error) {
    console.error("applyCoupon error:", error);
    if (error?.code === 11000) {
      return res.status(400).json({
        message: "Mã giảm giá đã được ghi nhận cho đơn hàng này",
      });
    }
    if (error?.isOperational) {
      return res
        .status(error.statusCode || 400)
        .json({ message: error.message });
    }
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = { validateCoupon, applyCoupon };
