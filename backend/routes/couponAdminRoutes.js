const express = require("express");
const couponController = require("../controller/couponAdminController");
const router = express.Router();
const { protect, admin } = require('../Middleware/authMiddleware');
// Admin routes
router.get("/coupons", protect,admin,couponController.getAllCoupons);       
router.post("/coupons",protect,admin, couponController.createCoupon);      
router.put("/coupons/:id", protect,admin,couponController.updateCoupon);    
router.patch("/coupons/:id/toggle", protect,admin,couponController.toggleCouponStatus); 
router.delete("/coupons/:id", protect,admin,couponController.deleteCoupon); 

module.exports = router;
