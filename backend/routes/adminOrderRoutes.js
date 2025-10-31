const express = require('express');
const router = express.Router();
const { protect, admin } = require('../Middleware/authMiddleware');
const adminOrderController = require('../controller/adminOrderController');

router.get("/orders", protect, admin, adminOrderController.getAllOrders);
router.put("/orders/:id", protect, admin, adminOrderController.updateStatusOrder);
router.delete("/orders/:id", protect, admin, adminOrderController.deleteOrder);
router.get("/orders/search", protect, admin, adminOrderController.searchOrders);
module.exports = router;