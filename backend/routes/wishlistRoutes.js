const wishlistController = require("../controller/wishlistController");
const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/authMiddleware");

router.get("/", protect, wishlistController.getWishlist);
router.post("/:productId", protect, wishlistController.addToWishlist);
router.delete("/:productId", protect, wishlistController.removeFromWishlist);

module.exports = router;
