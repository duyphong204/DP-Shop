const Product = require("../models/Product");

const productController = {
  getProductsByFilters: async (req, res) => {
    try {
      const {
        collection,
        size,
        color,
        minPrice,
        maxPrice,
        sortBy,
        search,
        category,
        material,
        brand,
        limit,
        page,
        pageSize,
      } = req.query;

      // Get gender from headers if not in query
      const gender = req.query.gender || req.headers.gender;

      let query = {};
      // Filter logic
      if (collection && collection.toLowerCase() !== "all") {
        query.collections = collection;
      }
      if (category && category.toLowerCase() !== "all") {
        query.category = category;
      }
      if (material) {
        query.material = { $in: material.split(",") };
      }
      if (brand) {
        query.brand = { $in: brand.split(",") };
      }
      if (size) {
        query.sizes = { $in: size.split(",") };
      }
      if (color) {
        const colors = color.split(",").map((c) => c.trim());
        query.colors = { $in: colors };
      }
      if (gender) {
        query.gender = gender;
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }
      let sort = {};
      if (sortBy) {
        switch (sortBy) {
          case "priceAsc":
            sort = { price: 1 };
            break;
          case "priceDesc":
            sort = { price: -1 };
            break;
          case "popularity":
            sort = { rating: -1 };
            break;
          default:
            break;
        }
      }

      let products = await Product.find(query)
        .sort(sort)
        .limit(Number(limit) || 0);
      res.status(200).json(products);
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: "product not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("server error");
    }
  },
  getSimilarProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "product not found" });
      }
      // product similar
      const similarProduct = await Product.find({
        _id: { $ne: id }, // exclude the current product id
        gender: product.gender,
        category: product.category,
      }).limit(4);
      res.json(similarProduct);
    } catch (error) {
      console.error(error);
      res.status(500).send("server error");
    }
  },
  getBestSeller: async (req, res) => {
    try {
      const products = await Product.find({ isPublished: true ,soldCount: { $gt: 0 }})
        .sort({ soldCount: -1 ,createdAt: -1}) // nếu soldCount bằng nhau thì sort theo mới nhất
        .limit(8)
        .select("name price images soldCount rating");
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
  newArrivalsProduct: async (req, res) => {
    try {
      const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(6);
      res.json(newArrivals);
    } catch (err) {
      console.error(err);
      res.status(500).send("server error");
    }
  },
};

module.exports = productController;
