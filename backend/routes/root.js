const express = require("express");
const router = express.Router();
const productRoutes = require("./productRoutes");
const userRoutes = require("./userRoutes");
const cartRoutes = require("./CartRoutes");


router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);

module.exports = router;
