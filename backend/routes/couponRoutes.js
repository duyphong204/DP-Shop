const express = require("express");
const couponController = require("../controller/couponController");
const router = express.Router();
const { protect } = require('../Middleware/authMiddleware');
// User routes
router.post("/validate",protect,couponController.validateCoupon);
router.post("/apply",protect,couponController.applyCoupon)

module.exports = router;
