const Order = require("../models/Order");

const orderController = {
  getMyOrders: async (req, res) => {
    try {
      // find orders for the authenticated user
      const orders = await Order.find({ user: req.user._id }).sort({
        createdAt: -1,
      }); //
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "server error" });
    }
  },
  getOrderById: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
      );
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "server error" });
    }
  },
};

module.exports = orderController;
