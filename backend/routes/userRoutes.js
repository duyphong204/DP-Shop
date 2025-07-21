const express = require("express");
const router = express.Router();
const UserController = require("../controller/userController");
const { protect } = require("../Middleware/authMiddleware");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/refresh-token", UserController.refreshToken);
router.get("/profile", protect, UserController.getProfile);

module.exports = router;
