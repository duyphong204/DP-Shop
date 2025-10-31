const express = require('express');
const router = express.Router();
const productAdminController = require('../controller/productAdminController');
const { protect, admin } = require('../Middleware/authMiddleware');

router.get("/products", protect, admin, productAdminController.getAllProducts);
router.get("/products/search", protect, admin, productAdminController.searchProducts);
router.put("/products/:id", protect, admin, productAdminController.updateProduct);
router.post("/products", protect, admin, productAdminController.createProduct);
router.delete("/products/:id", protect, admin, productAdminController.deleteProduct);//ok
module.exports = router;