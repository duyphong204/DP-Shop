const express = require("express");
const router = express.Router();
const productRoutes = require("./productRoutes");
const userRoutes = require("./userRoutes");
const cartRoutes = require("./CartRoutes");
const checkoutRoutes = require("./checkoutRoutes");
const orderRoutes = require("./orderRoutes");
const uploadRoutes = require("./uploadRoutes");
const subscriberRoutes = require("./subscriberRoutes");

router.use("/orders", orderRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/upload", uploadRoutes);
router.use("/subscriber", subscriberRoutes);


module.exports = router;
