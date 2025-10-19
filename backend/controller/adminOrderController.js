const Order = require("../models/Order");

const findOrderById = async (id) => {
  return await Order.findById(id).populate("user", "name email");
};

const adminOrderController = {
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find({}).populate("user", "name email").sort({createdAt :-1});
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
};

module.exports = adminOrderController;
