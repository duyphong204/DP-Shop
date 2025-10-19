const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");

/**
 *  Cập nhật rating trung bình và số review của sản phẩm
 */
const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId }).lean();
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  await Product.findByIdAndUpdate(productId, {
    rating: avgRating,
    numReviews: reviews.length,
  });
};

/**
 * @desc   Tạo review mới
 * @route  POST /api/reviews/:productId/create
 * @access Private
 * @note   Chỉ đánh giá 1 lần, không cho sửa
 */
exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user._id;
    const productId = req.params.productId;

    // Kiểm tra product có tồn tại
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Kiểm tra user đã mua sản phẩm chưa
    const hasPurchased = await Order.findOne({
      user: userId,
      "orderItems.productId": productId,
      isDelivered: true,
    });
    if (!hasPurchased)
      return res
        .status(403)
        .json({ message: "Bạn chỉ có thể đánh giá sản phẩm đã nhận hàng!" });

    // Kiểm tra user đã đánh giá chưa
    const existing = await Review.findOne({ user: userId, product: productId });
    if (existing)
      return res.status(403).json({ message: "Bạn chỉ được đánh giá 1 lần" });

    // Tạo review mới
    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment,
    });

    // Push review vào product
    product.reviews.push(review._id);
    await product.save();

    //  Cập nhật lại rating sản phẩm
    await updateProductRating(productId);

    // Populate user để frontend có tên người đánh giá
    const populatedReview = await Review.findById(review._id).populate(
      "user",
      "name"
    );

    res.status(201).json({ message: "Đã đánh giá", review: populatedReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc   Lấy tất cả review của sản phẩm
 * @route  GET /api/reviews/:productId
 * @access Public
 */
exports.getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean();

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    res.json({reviews, avgRating});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc   Xóa review (chỉ người tạo được xóa)
 * @route  DELETE /api/reviews/:id
 * @access Private
 */
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await review.deleteOne();

    // Cập nhật rating sản phẩm
    await updateProductRating(review.product);

    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
