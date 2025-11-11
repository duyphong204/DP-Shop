const express = require("express");
const couponController = require("../controller/couponController");
const router = express.Router();

// User routes
router.post("/validate", couponController.validateCoupon);
router.post("/apply", couponController.applyCoupon)

module.exports = router;
