// controllers/couponController.js
const mongoose = require("mongoose");
const Coupon = require("../models/Coupon");
const CouponUsage = require("../models/CouponUsage");

const validateCoupon = async (req, res) => {
  try {
    const { code, userId, totalPrice } = req.body;

    // Kiểm tra thông tin
    if (!code || !userId || totalPrice == null) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }

    // Tìm coupon (trim + uppercase)
    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });
    if (!coupon) {
      return res.status(404).json({ message: "Mã giảm giá không tồn tại" });
    }

    const now = new Date();
    if (!coupon.isActive || now < coupon.startDate || now > coupon.endDate) {
      return res.status(400).json({ message: "Mã giảm giá không hợp lệ hoặc đã hết hạn" });
    }

    // Kiểm tra đã dùng chưa
    const used = await CouponUsage.findOne({
      user: mongoose.Types.ObjectId(userId),
      coupon: coupon._id,
    });
    if (used) {
      return res.status(400).json({ message: "Bạn đã sử dụng mã này rồi" });
    }

    // Kiểm tra đơn tối thiểu
    const price = Number(totalPrice);
    if (coupon.minOrderValue && price < coupon.minOrderValue) {
      return res.status(400).json({
        message: `Đơn hàng phải từ ${coupon.minOrderValue.toLocaleString()}₫ trở lên`,
      });
    }

    // Tính giá trị giảm
    let discountAmount = 0;
    if (coupon.discountType === "percent") {
      discountAmount = (price * coupon.discountValue) / 100;
      if (coupon.maxDiscountValue) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountValue);
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    res.json({
      couponId: coupon._id,
      code: coupon.code,
      discountAmount,
      message: "Mã hợp lệ",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const applyCoupon = async (req, res) => {
  try {
    const { couponId, userId, orderId } = req.body;

    if (!couponId || !userId || !orderId) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }

    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({ message: "Mã giảm giá không tồn tại" });
    }

    const used = await CouponUsage.findOne({
      user: mongoose.Types.ObjectId(userId),
      coupon: coupon._id,
    });
    if (used) {
      return res.status(400).json({ message: "Bạn đã sử dụng mã này rồi" });
    }

    await CouponUsage.create({
      user: mongoose.Types.ObjectId(userId),
      coupon: coupon._id,
      order: mongoose.Types.ObjectId(orderId),
    });

    coupon.usedCount = (coupon.usedCount || 0) + 1;
    await coupon.save();

    res.json({ message: "Áp dụng mã giảm giá thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  validateCoupon,
  applyCoupon,
};
