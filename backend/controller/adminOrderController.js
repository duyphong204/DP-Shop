const Order = require('../models/Order');

const adminOrderController = {
    getAllOrders: async (req, res) => {
        try{
            const orders = await Order.find({}).populate('user', 'name email')
            res.json(orders);
        }catch(err){
            console.error(err)
            res.status(500).json({message: "server error"})
        }
    },
    updateStatusOrder: async (req, res) => {
        try{    
            const order = await Order.findById(req.params.id).populate("user","name");
            if(order){
                order.status = req.body.status || order.status;
                order.isDelivered = req.body.status === 'Delivered' ? true : order.isDelivered;
                order.deliveredAt = req.body.status === 'Delivered' ? Date.now() : order.deliveredAt;
                const updatedOrder = await order.save();
                res.json(updatedOrder);
            }else{
                return res.status(404).json({ message: "Order not found" });
            }
        }catch(err){
            console.error(err)
            res.status(500).json({message: "server error"})
        }
    },
    deleteOrder: async (req, res) => {
        try{
            const order = await Order.findById(req.params.id);
            if(order){
                await order.deleteOne()
                res.json({message: "Order removed"})
            }else{
                res.status(404).json({ message: "Order not found" });
            }
        }catch(error){
            console.error(error)
            res.status(500).json({message: "server error"})
        }
    }
}
module.exports = adminOrderController