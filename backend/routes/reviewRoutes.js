const router = require("express").Router();
const reviewController = require("../controller/reviewController"); 
const { protect } = require("../Middleware/authMiddleware");

// Lấy tất cả review của sản phẩm
router.get("/:productId", reviewController.getReviewsByProduct);

// Tạo review mới
router.post("/:productId/create", protect, reviewController.createReview);

// Cập nhật review
router.put("/:productId/update", protect, reviewController.updateReview);

// Xóa review
router.delete("/:id", protect, reviewController.deleteReview);

module.exports = router;
