const Coupon = require("../models/Coupon");
const CouponUsage = require("../models/CouponUsage");

const getAllCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const coupons = await Coupon.find()
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalItems = await Coupon.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    res.json({ coupons, page: parseInt(page), totalPages, totalItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const createCoupon = async (req, res) => {
  try {
    const data = req.body;
    data.code = data.code.toUpperCase();
    const coupon = await Coupon.create(data);
    res.status(201).json(coupon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Thêm coupon thất bại" });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!coupon)
      return res.status(404).json({ message: "Coupon không tồn tại" });
    res.json(coupon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cập nhật coupon thất bại" });
  }
};

const toggleCouponStatus = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon)
      return res.status(404).json({ message: "Coupon không tồn tại" });
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json(coupon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cập nhật trạng thái thất bại" });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon)
      return res.status(404).json({ message: "Coupon không tồn tại" });
    res.json({ message: "Xóa coupon thành công", id: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Xóa coupon thất bại" });
  }
};

module.exports = {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  toggleCouponStatus,
  deleteCoupon,
};
