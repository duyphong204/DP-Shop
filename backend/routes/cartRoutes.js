const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const {protect} = require("../middleware/authMiddleware");
const cartController = require("../controller/cartController");

router.post("/",cartController.createCart);
router.put("/", cartController.updateCart);
router.delete("/", cartController.deleteCart);
router.get("/", cartController.getCart);
router.post("/merge",protect,cartController.mergeGuestCart);

module.exports = router;