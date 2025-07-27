const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
// const {protect} = require("../middleware/authMiddleware");
const cartController = require("../controller/cartController");

router.post("/",cartController.createCart);
router.put("/", cartController.updateCart);

module.exports = router;