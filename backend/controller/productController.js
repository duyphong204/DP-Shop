const Product = require("../models/Product");

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getProductsByFilters: async (req, res) => {
    try {
      console.log("Query Params:", req.query);
      console.log("Headers:", req.headers);

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
      } = req.query;

      // Get gender from headers if not in query
      const gender = req.query.gender || req.headers.gender;
      console.log("Gender value:", gender);

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
        query.colors = { $in: [color] };
      }
      if (gender) {
        console.log("Adding gender to query:", gender);
        query.gender = gender;
      }
      console.log("Final query:", query);

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
      console.log("Found products:", products.length);
      res.status(200).json(products);
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  createProduct: async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        discountPrice,
        countInStock,
        category,
        brand,
        sizes,
        colors,
        collections,
        material,
        gender,
        images,
        isFeatured,
        isPublished,
        tags,
        dimensions,
        weight,
        sku,
      } = req.body;

      const product = new Product({
        name,
        description,
        price,
        discountPrice,
        countInStock,
        category,
        brand,
        sizes,
        colors,
        collections,
        material,
        gender,
        images,
        isFeatured,
        isPublished,
        tags,
        dimensions,
        weight,
        sku,
        user: req.user._id,
      });

      const createdProduct = await product.save();
      res.status(201).json(createdProduct);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: "product not found" });
      }
    } catch (err) {
      res.status(500).json(err);
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
      const similarProduct = await Product.find(
        {
          _id: { $ne: id },
          gender: product.gender,
          category: product.category,
        }).limit(4)
        res.json(similarProduct)
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getBestSeller:async(req,res)=>{
    try{
        const bestSeller = await Product.findOne().sort({rating:-1})
        if(bestSeller){
            res.json(bestSeller)
        }else{
            res.status(404).json({message:"Not best seller found"})
        }
    }catch(err){
        res.status(500).json(err)
    }
  },
  newArrivalsProduct:async(req,res)=>{
    try{
        const newArrivals=await Product.find().sort({createdAt:-1}).limit(8)
        res.json(newArrivals)
    }catch(err){
        res.status(500).json(err)
    }
  }
};

module.exports = productController;
