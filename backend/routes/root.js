const express = require("express");
const router = express.Router();
const productRoutes = require("./productRoutes");
const userRoutes = require("./userRoutes");
const cartRoutes = require("./cartRoutes");
const checkoutRoutes = require("./checkoutRoutes");
const orderRoutes = require("./orderRoutes");
const uploadRoutes = require("./uploadRoutes");
const subscriberRoutes = require("./subscriberRoutes");
const adminRoutes = require("./adminRoutes");
const productAdminRoutes = require("./productAdminRoutes");
const adminOrderRoutes = require("./adminOrderRoutes");


router.use("/orders", orderRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/upload", uploadRoutes);
router.use("/subscriber", subscriberRoutes);

router.use("/admin", adminRoutes);
router.use("/admin", productAdminRoutes);
router.use("/admin", adminOrderRoutes);

module.exports = router;
