const mongoose = require("mongoose");

const couponUsageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  usedAt: { type: Date, default: Date.now },
});
couponUsageSchema.index({ user: 1, coupon: 1 }, { unique: true });
couponUsageSchema.index({ order: 1 }, { unique: true });


module.exports = mongoose.model("CouponUsage", couponUsageSchema);
