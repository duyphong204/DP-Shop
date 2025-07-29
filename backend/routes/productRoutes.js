const router = require("express").Router();
const productController = require("../controller/productController");
const { protect, admin } = require("../Middleware/authMiddleware");

router.get("/", productController.getAllProducts);
router.get("/filters", productController.getProductsByFilters);
router.get("/best-seller", productController.getBestSeller);
router.get("/new-arrivals", productController.newArrivalsProduct);
router.get("/similar/:id", productController.getSimilarProduct);
router.get("/:id", productController.getProductById);

router.post("/", protect, admin, productController.createProduct);
router.put("/:id", protect, admin, productController.updateProduct);
router.delete("/:id", protect, admin, productController.deleteProduct);

module.exports = router;
