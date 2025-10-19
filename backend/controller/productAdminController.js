const Product = require("../models/Product");

const productAdminController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find({});
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "server error" });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Ensure images are included in the update
      if (!updateData.images || !Array.isArray(updateData.images)) {
        return res.status(400).json({ message: "Images must be an array" });
      }

      const product = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "server error" });
    }
  },
  createProduct: async (req, res) => {
    try {
      // Kiểm tra các trường bắt buộc
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

      // Tạo sản phẩm với các trường còn lại nếu có
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
        // Các trường khác nếu có thì truyền vào
        ...req.body,
      });

      const createdProduct = await product.save();
      res.status(201).json(createdProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      // find the product by id
      const product = await Product.findById(req.params.id);
      if (product) {
        await product.deleteOne();
        res.json({ message: "Product removed" });
      } else {
        res.status(404).json({ message: "product not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("server error");
    }
  },
};

module.exports = productAdminController;
