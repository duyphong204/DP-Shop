// controllers/adminOrderController.js
const Order = require("../models/Order");
const { paginate } = require("../utils/pagination");

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const adminOrderController = {
  getAllOrders: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const data = await paginate(Order, {}, { page, limit, sort: { createdAt: -1 } });
      const results = await Order.populate(data.results, { path: "user", select: "name email" });
      res.json({ ...data, results });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  updateStatusOrder: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate("user", "name email");
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
      res.json(updatedOrder);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      await order.deleteOne();
      res.json({ message: "Order removed" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  searchOrders: async (req, res) => {
    try {
      const { term, page = 1, limit = 10 } = req.query;
      if (!term?.trim()) {
        return res.json({ results: [], page: 1, totalPages: 1, totalItems: 0 });
      }

      const trimmed = term.trim();
      let query = {};

      if (/^[a-f\d]{24}$/i.test(trimmed)) {
        query = { _id: trimmed };
      } else {
        const regex = new RegExp(escapeRegex(trimmed), "i");
        query = {
          $or: [
            { "shippingAddress.address": regex },
            { "shippingAddress.city": regex },
            { "shippingAddress.country": regex },
            { "shippingAddress.postalCode": regex },
          ],
        };
      }

      const data = await paginate(Order, query, { page, limit, sort: { createdAt: -1 } });
      const results = await Order.populate(data.results, { path: "user", select: "name email" });
      res.json({ ...data, results });
    } catch (error) {
      console.error("searchOrders error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = adminOrderController;