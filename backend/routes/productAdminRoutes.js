const express = require('express');
const router = express.Router();
const productAdminController = require('../controller/productAdminController');
const { protect, admin } = require('../Middleware/authMiddleware');

router.get("/products", protect, admin, productAdminController.getAllProducts);
router.put("/:id", protect, admin, productAdminController.updateProduct);

module.exports = router;