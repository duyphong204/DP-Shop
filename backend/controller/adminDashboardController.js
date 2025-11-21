const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const adminDashboardController = {
  getDashboardStats: async (req, res) => {
    try {
      const { timeRange } = req.query; // ngay,thang,nam

      // Tổng doanh thu & đơn hàng
      const totalRevenue = await Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
      ]);

      let dateGroupFormat;
      let startDate = new Date();

      if (timeRange === "monthly") {
        startDate.setFullYear(startDate.getFullYear() - 1);
        dateGroupFormat = "%Y-%m";
      } else if (timeRange === "yearly") {
        startDate.setFullYear(startDate.getFullYear() - 5);
        dateGroupFormat = "%Y";
      } else {
        // Mặc định hàng ngày (30 ngày gần nhất)
        startDate.setDate(startDate.getDate() - 30);
        dateGroupFormat = "%Y-%m-%d";
      }

      // Doanh thu theo thời gian
      const salesData = await Order.aggregate([
        {
          $match: {
            isPaid: true,
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: dateGroupFormat, date: "$createdAt" } },
            sales: { $sum: "$totalPrice" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // Sản phẩm bán chạy nhất
      const topSellingProducts = await Order.aggregate([
        { $match: { isPaid: true } },
        { $unwind: "$orderItems" },
        {
          $group: {
            _id: "$orderItems.productId",
            name: { $first: "$orderItems.name" },
            image: { $first: "$orderItems.image" },
            totalSold: { $sum: "$orderItems.quantity" },
            revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
      ]);

      // Tình trạng hàng tồn kho
      const lowStockProducts = await Product.find({ countInStock: { $lt: 10 } })
        .select("name countInStock images")
        .limit(5);

      // Tổng người dùng
      const totalUsers = await User.countDocuments();

      // Top sản phẩm trong wishlist
      const topWishlistProducts = await User.aggregate([
        { $unwind: "$wishlist" },
        {
          $group: {
            _id: "$wishlist",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        {
          $project: {
            _id: 1,
            name: "$product.name",
            image: { $arrayElemAt: ["$product.images.url", 0] },
            count: 1,
          },
        },
      ]);

      res.json({
        totalRevenue: totalRevenue[0]?.total || 0,
        totalOrders: totalRevenue[0]?.count || 0,
        totalUsers,
        salesData,
        topSellingProducts,
        lowStockProducts,
        topWishlistProducts,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = adminDashboardController;
