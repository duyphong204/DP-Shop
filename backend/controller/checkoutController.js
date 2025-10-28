const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");

const checkoutController = {
  // Tạo phiên thanh toán mới
  createCheckoutSession: async (req, res) => {
    try {
      const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
        req.body;

      // Kiểm tra nếu không có sản phẩm
      if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ message: "No items to checkout" });
      }

      // Tạo checkout mới
      const newCheckout = await Checkout.create({
        user: req.user._id,
        checkoutItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
        paymentStatus: "Pending",
        isPaid: false,
      });

      return res.status(202).json(newCheckout);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  },

  // Đánh dấu thanh toán thành công
  markAsPaid: async (req, res) => {
    try {
      const { paymentStatus, paymentDetails } = req.body;

      const checkout = await Checkout.findById(req.params.id);
      if (!checkout) {
        return res.status(404).json({ message: "Checkout not found" });
      }

      if (paymentStatus === "Paid") {
        checkout.isPaid = true;
        checkout.paymentStatus = paymentStatus;
        checkout.paymentDetails = paymentDetails; // lưu chi tiết thanh toán
        checkout.paidAt = Date.now();
        await checkout.save();

        return res.status(200).json(checkout);
      } else {
        return res
          .status(400)
          .json({ message: `Invalid payment status: ${paymentStatus}` });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  },

  // Hoàn tất checkout, tạo order cuối, cập nhật soldCount, xóa cart
  finalizeCheckout: async (req, res) => {
    try {
      const checkout = await Checkout.findById(req.params.id);
      if (!checkout) {
        return res.status(404).json({ message: "Checkout not found" });
      }

      // Chỉ finalize nếu đã thanh toán và chưa finalize
      if (checkout.isPaid && !checkout.isFinalized) {
        // Tạo order cuối cùng
        const finalOrder = await Order.create({
          user: checkout.user,
          orderItems: checkout.checkoutItems,
          shippingAddress: checkout.shippingAddress,
          paymentMethod: checkout.paymentMethod,
          totalPrice: checkout.totalPrice,
          isPaid: true,
          paidAt: checkout.paidAt,
          isDelivered: false,
          paymentStatus: "Paid",
          paymentDetails: checkout.paymentDetails,
        });

        // Cập nhật số lượng soldCount cho từng product
        for (const item of checkout.checkoutItems) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { soldCount: item.quantity },
          });
        }

        // Đánh dấu checkout đã finalize
        checkout.isFinalized = true;
        checkout.finalizedAt = Date.now();
        await checkout.save();

        // Xóa cart của user
        await Cart.findOneAndDelete({ user: checkout.user });

        return res.status(201).json(finalOrder);
      } else if (checkout.isFinalized) {
        return res.status(400).json({ message: "Checkout already finalized" });
      } else {
        return res.status(400).json({ message: "Checkout not paid yet" });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  },
};

module.exports = checkoutController;
