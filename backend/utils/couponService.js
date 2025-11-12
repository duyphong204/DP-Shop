const mongoose = require("mongoose");
const Coupon = require("../models/Coupon");
const CouponUsage = require("../models/CouponUsage");

const createCouponError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

const normalizeCode = (code = "") => code.trim().toUpperCase();

const findCoupon = async ({ couponId, couponCode, session }) => {
  if (couponId && !mongoose.Types.ObjectId.isValid(couponId)) {
    throw createCouponError("Mã coupon không hợp lệ");
  }

  const query = couponId
    ? { _id: couponId }
    : couponCode
    ? { code: normalizeCode(couponCode) }
    : null;

  if (!query) {
    throw createCouponError("Thiếu thông tin mã giảm giá");
  }

  const coupon = await Coupon.findOne(query).session(session || null);
  if (!coupon) {
    throw createCouponError("Mã giảm giá không tồn tại", 404);
  }
  return coupon;
};

const ensureCouponActive = (coupon) => {
  const now = new Date();
  if (!coupon.isActive || now < coupon.startDate || now > coupon.endDate) {
    throw createCouponError("Mã giảm giá không hợp lệ hoặc đã hết hạn");
  }
};

const ensureUsageLimits = async ({ coupon, userId, session }) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw createCouponError("UserId không hợp lệ");
  }

  const [userUsage] = await Promise.all([
    CouponUsage.findOne({ user: userId, coupon: coupon._id }).session(
      session || null
    ),
  ]);

  if (userUsage) {
    throw createCouponError("Bạn đã sử dụng mã này rồi");
  }

  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    throw createCouponError("Mã giảm giá đã đạt số lượt sử dụng tối đa");
  }
};

const ensureOrderValue = (coupon, orderTotal) => {
  if (
    typeof orderTotal !== "number" ||
    Number.isNaN(orderTotal) ||
    orderTotal <= 0
  ) {
    throw createCouponError("Tổng giá trị đơn không hợp lệ");
  }

  if (coupon.minOrderValue && orderTotal < coupon.minOrderValue) {
    throw createCouponError(
      `Đơn hàng phải từ ${coupon.minOrderValue.toLocaleString()}₫ trở lên`
    );
  }
};

const computeDiscount = (coupon, orderTotal) => {
  const value = Number(coupon.discountValue) || 0;
  if (value <= 0) {
    throw createCouponError("Mã giảm giá không hợp lệ");
  }

  let discountAmount = 0;

  if (coupon.discountType === "percent") {
    discountAmount = (orderTotal * value) / 100;
    if (coupon.maxDiscountValue) {
      const max = Number(coupon.maxDiscountValue) || 0;
      discountAmount = Math.min(discountAmount, max);
    }
  } else {
    discountAmount = value;
  }

  return Math.min(discountAmount, orderTotal);
};

const validateCouponForUser = async ({
  couponId,
  couponCode,
  userId,
  orderTotal,
  session,
}) => {
  const coupon = await findCoupon({ couponId, couponCode, session });
  ensureCouponActive(coupon);
  await ensureUsageLimits({ coupon, userId, session });
  ensureOrderValue(coupon, orderTotal);

  const discountAmount = computeDiscount(coupon, orderTotal);

  return { coupon, discountAmount };
};

module.exports = {
  normalizeCode,
  validateCouponForUser,
  computeDiscount,
  createCouponError,
};
