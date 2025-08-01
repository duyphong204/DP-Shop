const express = require('express');
const router = express.Router();
const productAdminController = require('../controller/productAdminController');
const { protect, admin } = require('../Middleware/authMiddleware');

router.get("/products", protect, admin, productAdminController.getAllProducts);


module.exports = router;