const Order = require("../models/Order");
const findOrderById = async (id) => {
  return await Order.findById(id).populate("user", "name email");
};

// escape ký tự đặc biệt trong regex
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const adminOrderController = {
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find({})
        .populate("user", "name email")
        .sort({ createdAt: -1 });

      res.status(200).json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  updateStatusOrder: async (req, res) => {
    try {
      const order = await findOrderById(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      const { status } = req.body;
      if (status) {
        order.status = status;

        if (status === "Delivered") {
          order.isDelivered = true;
          order.deliveredAt = Date.now();
        }
      }

      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const order = await findOrderById(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      await order.deleteOne();
      res.status(200).json({ message: "Order removed" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Tìm kiếm đơn hàng
  searchOrders: async (req, res) => {
    try {
      const { term } = req.query;
      if (!term?.trim()) return res.json({ orders: [] });

      const trimmed = term.trim().toLowerCase();
      const esc = escapeRegex(trimmed);

      // Nếu là ObjectId hợp lệ => tìm trực tiếp
      if (/^[a-f\d]{24}$/i.test(trimmed)) {
        const order = await Order.findById(trimmed).populate("user", "name email");
        return res.json({ orders: order ? [order] : [] });
      }

      // Lấy danh sách order (giới hạn 200 để tăng tốc)
      let orders = await Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(200);

      const regex = new RegExp(esc, "i");
      orders = orders.filter(
        (o) =>
          regex.test(o.user?.name || "") ||
          regex.test(o.user?.email || "") ||
          regex.test(o.shippingAddress?.address || "") ||
          regex.test(o.shippingAddress?.city || "") ||
          regex.test(o.shippingAddress?.country || "") ||
          regex.test(o.shippingAddress?.postalCode || "")
      );

      res.json({ orders: orders.slice(0, 20) });
    } catch (error) {
      console.error("searchOrders error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = adminOrderController;
