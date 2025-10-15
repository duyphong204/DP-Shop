const express = require("express");
const router = express.Router();
const UserController = require("../controller/userController");
const { protect } = require("../Middleware/authMiddleware");
const {validateLogin,validateRegistration} = require("../Middleware/authValidator")


router.post("/register", validateRegistration,UserController.register);
router.post("/login",validateLogin, UserController.login);
router.post("/refresh-token", UserController.refreshToken);
router.get("/profile", protect, UserController.getProfile);

module.exports = router;
