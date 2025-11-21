const express = require("express");
const { protect, admin } = require("../Middleware/authMiddleware");
const { getDashboardStats } = require("../controller/adminDashboardController");

const router = express.Router();
router.get("/stats", protect, admin, getDashboardStats);

module.exports = router;
