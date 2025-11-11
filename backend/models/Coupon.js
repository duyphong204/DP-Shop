const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
    },
    discountType: {
      type: String,
      enum: ["percent", "fixed"], // giảm theo % hoặc tiền
      required: true,
    },
    discountValue: {
      type: Number,
      required: true, // 10% hoặc 50000
    },
    minOrderValue: {
      type: Number,
      default: 0, // đơn hàng tối thiểu để áp dụng
    },
    maxDiscountValue: {
      type: Number,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: 0, // 0 = không giới hạn số người dùng
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
