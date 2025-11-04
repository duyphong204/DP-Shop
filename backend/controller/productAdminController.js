// controllers/productAdminController.js
const Product = require("../models/Product");
const { paginate } = require("../utils/pagination");

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const productAdminController = {
  getAllProducts: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const data = await paginate(Product, {}, { page, limit, sort: { createdAt: -1 } });
      res.json(data);
    } catch (error) {
      console.error("getAllProducts error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  searchProducts: async (req, res) => {
    try {
      const { term, page = 1, limit = 10 } = req.query;
      if (!term?.trim()) {
        return res.json({ results: [], page: 1, totalPages: 1, totalItems: 0 });
      }

      const regex = new RegExp(escapeRegex(term.trim()), "i");
      const query = { $or: [{ name: regex }, { sku: regex }] };

      const data = await paginate(Product, query, { page, limit, sort: { createdAt: -1 } });
      res.json(data);
    } catch (error) {
      console.error("searchProducts error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!updateData.images || !Array.isArray(updateData.images)) {
        return res.status(400).json({ message: "Images must be an array" });
      }

      const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (error) {
      console.error("updateProduct error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  createProduct: async (req, res) => {
    try {
      const required = ["name", "description", "price", "countInStock", "sku", "category", "brand", "sizes", "colors", "images", "gender"];
      const missing = required.filter(f => !req.body[f] || (Array.isArray(req.body[f]) && req.body[f].length === 0));
      if (missing.length > 0) return res.status(400).json({ message: `Missing: ${missing.join(", ")}` });

      const product = new Product({ ...req.body, user: req.user._id });
      const created = await product.save();
      res.status(201).json(created);
    } catch (error) {
      console.error("createProduct error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } catch (error) {
      console.error("deleteProduct error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = productAdminController;