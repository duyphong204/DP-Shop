const express=require('express');
const router=express.Router();
const orderController=require('../controller/orderController');
const {protect}=require('../middleware/authMiddleware');


router.get("/my-orders",protect,orderController.getMyOrders);
router.get("/:id",protect,orderController.getOrderById);

module.exports=router;