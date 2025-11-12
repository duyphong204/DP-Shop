const Coupon = require("../models/Coupon");
const CouponUsage = require("../models/CouponUsage");
const { paginate } = require("../utils/pagination");

const getAllCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const { results, page: currentPage, totalPages, totalItems } = await paginate(
      Coupon,{},{ page, limit, sort: { createdAt: -1 } }
    );
    res.json({
      coupons: results,
      page: currentPage,
      totalPages,
      totalItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      maxDiscountValue,
      minOrderValue,
      usageLimit,
      startDate,
      endDate,
      isActive,
    } = req.body;

    if (!code || !discountType || !discountValue || !startDate || !endDate) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    if (!["percent", "fixed"].includes(discountType)) {
      return res.status(400).json({ message: "Loại giảm giá không hợp lệ" });
    }

    const normalizedCode = code.trim().toUpperCase();

    if (await Coupon.findOne({ code: normalizedCode })) {
      return res.status(400).json({ message: "Mã giảm giá đã tồn tại" });
    }

    const parsedDiscountValue = Number(discountValue);
    if (Number.isNaN(parsedDiscountValue) || parsedDiscountValue <= 0) {
      return res.status(400).json({ message: "Giá trị giảm không hợp lệ" });
    }

    if (discountType === "percent" && parsedDiscountValue > 100) {
      return res.status(400).json({ message: "Phần trăm giảm tối đa là 100%" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ message: "Ngày bắt đầu/kết thúc không hợp lệ" });
    }

    if (start >= end) {
      return res.status(400).json({ message: "Ngày kết thúc phải sau ngày bắt đầu" });
    }

    const payload = {
      code: normalizedCode,
      description: description?.trim() || "",
      discountType,
      discountValue: parsedDiscountValue,
      maxDiscountValue: maxDiscountValue ? Number(maxDiscountValue) : undefined,
      minOrderValue: minOrderValue ? Number(minOrderValue) : 0,
      usageLimit: usageLimit ? Number(usageLimit) : 0,
      startDate: start,
      endDate: end,
      isActive: isActive ?? true,
    };

    if (payload.maxDiscountValue && payload.maxDiscountValue < 0) {
      return res.status(400).json({ message: "Giá trị giảm tối đa không hợp lệ" });
    }

    if (payload.minOrderValue < 0) {
      return res.status(400).json({ message: "Đơn hàng tối thiểu không hợp lệ" });
    }

    if (payload.usageLimit < 0 || !Number.isInteger(payload.usageLimit)) {
      return res.status(400).json({ message: "Giới hạn sử dụng phải lớn hơn hoặc bằng 0" });
    }

    if (payload.discountType !== "percent") {
      payload.maxDiscountValue = undefined;
    }

    const coupon = await Coupon.create(payload);
    res.status(201).json(coupon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Thêm coupon thất bại" });
  }
};



const updateCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      maxDiscountValue,
      minOrderValue,
      usageLimit,
      startDate,
      endDate,
      isActive,
    } = req.body;

    const coupon = await Coupon.findById(req.params.id);
    if (!coupon)
      return res.status(404).json({ message: "Coupon không tồn tại" });

    if (code) {
      const normalizedCode = code.trim().toUpperCase();
      if (normalizedCode !== coupon.code) {
        const duplicate = await Coupon.findOne({ code: normalizedCode });
        if (duplicate) {
          return res.status(400).json({ message: "Mã giảm giá đã tồn tại" });
        }
        coupon.code = normalizedCode;
      }
    }

    if (description !== undefined) coupon.description = description.trim();
    if (discountType) {
      if (!["percent", "fixed"].includes(discountType)) {
        return res.status(400).json({ message: "Loại giảm giá không hợp lệ" });
      }
      coupon.discountType = discountType;
    }

    if (discountValue !== undefined) {
      const parsed = Number(discountValue);
      if (Number.isNaN(parsed) || parsed <= 0) {
        return res.status(400).json({ message: "Giá trị giảm không hợp lệ" });
      }
      if (coupon.discountType === "percent" && parsed > 100) {
        return res.status(400).json({ message: "Phần trăm giảm tối đa là 100%" });
      }
      coupon.discountValue = parsed;
    }

    if (maxDiscountValue !== undefined && coupon.discountType === "percent") {
      const parsed = Number(maxDiscountValue);
      if (Number.isNaN(parsed) || parsed < 0) {
        return res.status(400).json({ message: "Giá trị giảm tối đa không hợp lệ" });
      }
      coupon.maxDiscountValue = parsed || undefined;
    }

    if (coupon.discountType !== "percent") {
      coupon.maxDiscountValue = undefined;
    }

    if (minOrderValue !== undefined) {
      const parsed = Number(minOrderValue);
      if (Number.isNaN(parsed) || parsed < 0) {
        return res.status(400).json({ message: "Đơn hàng tối thiểu không hợp lệ" });
      }
      coupon.minOrderValue = parsed;
    }

    if (usageLimit !== undefined) {
      const parsed = Number(usageLimit);
      if (Number.isNaN(parsed) || parsed < 0 || !Number.isInteger(parsed)) {
        return res.status(400).json({ message: "Giới hạn sử dụng phải là số nguyên không âm" });
      }
      if (parsed > 0 && coupon.usedCount > parsed) {
        return res.status(400).json({ message: "Giới hạn nhỏ hơn số lượt đã sử dụng" });
      }
      coupon.usageLimit = parsed;
    }

    if (startDate) {
      const start = new Date(startDate);
      if (Number.isNaN(start.getTime())) {
        return res.status(400).json({ message: "Ngày bắt đầu không hợp lệ" });
      }
      coupon.startDate = start;
    }

    if (endDate) {
      const end = new Date(endDate);
      if (Number.isNaN(end.getTime())) {
        return res.status(400).json({ message: "Ngày kết thúc không hợp lệ" });
      }
      coupon.endDate = end;
    }

    if (coupon.startDate >= coupon.endDate) {
      return res.status(400).json({ message: "Ngày kết thúc phải sau ngày bắt đầu" });
    }

    if (typeof isActive === "boolean") {
      coupon.isActive = isActive;
    }

    await coupon.save();
    
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
