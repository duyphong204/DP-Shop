const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const {protect, admin} = require('../Middleware/authMiddleware');

router.get("/users",protect,admin,adminController.getAllUsers);
router.get("/users/search", protect, admin, adminController.searchUser);
router.post("/users",protect,admin,adminController.createUser);
router.put("/users/:id",protect,admin,adminController.updateUser);
router.delete("/users/:id",protect,admin,adminController.deleteUser);

module.exports = router;