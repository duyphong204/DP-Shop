const router = require("express").Router();
const productController = require("../controller/productController");
const { protect, admin } = require("../Middleware/authMiddleware");

//router.get("/", productController.getAllProducts);
router.get("/filters", productController.getProductsByFilters); //ok
router.get("/best-seller", productController.getBestSeller);//ok
router.get("/new-arrivals", productController.newArrivalsProduct);//ok
router.get("/similar/:id", productController.getSimilarProduct);//ok
router.get("/:id", productController.getProductById); // ok

router.post("/", protect, admin, productController.createProduct);//ok
router.put("/:id", protect, admin, productController.updateProduct);//ok
router.delete("/:id", protect, admin, productController.deleteProduct);//ok

module.exports = router;
