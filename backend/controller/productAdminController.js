const Product = require("../models/Product");

// escape ký tự đặc biệt trong regex
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const productAdminController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find({});
      res.json(products);
    } catch (error) {
      console.error("getAllProducts error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  searchProducts: async (req, res) => {
    try {
      const { term } = req.query;
      if (!term?.trim()) return res.json({ products: [] });

      const trimmed = term.trim();
      const esc = escapeRegex(trimmed);
      const regex = new RegExp(esc, "i");

      let products = await Product.find().limit(200);
      products = products.filter(
        (p) => regex.test(p.name) || regex.test(p.sku)
      );

      res.json({ products: products.slice(0, 20) });
    } catch (error) {
      console.error("searchProducts error:", error.message);
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

      const product = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!product)
        return res.status(404).json({ message: "Product not found" });

      res.json(product);
    } catch (error) {
      console.error("updateProduct error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  createProduct: async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        countInStock,
        sku,
        category,
        brand,
        sizes,
        colors,
        images,
        gender,
        material,
      } = req.body;

      if (
        !name ||
        !description ||
        !price ||
        !countInStock ||
        !sku ||
        !category ||
        !brand ||
        !Array.isArray(sizes) ||
        sizes.length === 0 ||
        !Array.isArray(colors) ||
        colors.length === 0 ||
        !Array.isArray(images) ||
        images.length === 0 ||
        !gender
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const product = new Product({
        name,
        description,
        price,
        countInStock,
        sku,
        category,
        brand,
        sizes,
        colors,
        images,
        gender,
        material: material || "",
        user: req.user._id,
        ...req.body,
      });

      const createdProduct = await product.save();
      res.status(201).json(createdProduct);
    } catch (error) {
      console.error("createProduct error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      await product.deleteOne();
      res.json({ message: "Product removed" });
    } catch (error) {
      console.error("deleteProduct error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = productAdminController;
