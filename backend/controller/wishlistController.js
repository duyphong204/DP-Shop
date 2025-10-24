// backend/controller/wishlistController.js
const User = require("../models/User");
const Product = require("../models/Product");

const wishlistController = {
  // Thêm sản phẩm vào wishlist
  addToWishlist: async (req, res) => {
    try {
      const userId = req.user.id;
      const productId = req.params.productId;
      const user = await User.findById(userId);
      if (!user) return res.status(400).json({ message: "User Not Found !" });

      const product = await Product.findById(productId);
      if (!product)
        return res.status(404).json({ message: "Product Not Found !" });

      if (!user.wishlist.includes(productId)) {
        user.wishlist.push(productId);
        await user.save();
      }
      // populate để trả về object đầy đủ
      const populatedUser = await User.findById(userId).populate({
        path: "wishlist",
        select: "_id name price images.url",
      });

      const wishlist = populatedUser.wishlist.map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        image: item.images.length > 0 ? item.images[0].url : null,
      }));

      res.json({
        message: "Add product to wishlist !",
        wishlist,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Xóa sản phẩm khỏi wishlist
  removeFromWishlist: async (req, res) => {
    try {
      const userId = req.user.id;
      const productId = req.params.productId;
      const user = await User.findById(userId);
      if (!user) return res.status(400).json({ message: "User Not Found  !" });

      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId.toString()
      );
      await user.save();
      // populate để trả về object đầy đủ
      const populatedUser = await User.findById(userId).populate({
        path: "wishlist",
        select: "_id name price images.url",
      });

      const wishlist = populatedUser.wishlist.map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        image: item.images.length > 0 ? item.images[0].url : null,
      }));

      res.json({
        message: "Removed from favorites list",
        wishlist,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Lấy danh sách wishlist của user
  getWishlist: async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).populate({
        path: "wishlist",
        select: "_id name price images.url", // Chỉ lấy _id, name, price, và URL ảnh đầu tiên
      });
      if (!user) return res.status(404).json({ message: "User Not Found !" });

      // Lấy URL ảnh đầu tiên nếu có
      const wishlist = user.wishlist.map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        image: item.images.length > 0 ? item.images[0].url : null,
      }));

      res.json({ wishlist });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = wishlistController;
