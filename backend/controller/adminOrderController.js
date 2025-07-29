const Order = require('../models/Order');

const adminOrderController = {
    getAllOrders: async (req, res) => {
        try{
            const orders = await Order.find({}).populate('user', 'name email')
            res.json(orders);
        }catch(err){
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    },
    updateStatusOrder: async (req, res) => {
        try{    
            const order = await Order.findById(req.params.id);
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
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    },
    deleteOrder: async (req, res) => {
        try{
            const {id} = req.params;
            const order = await Order.findByIdAndDelete(id);
            if(!order){
                return res.status(404).json({ message: "Order not found" });
            }
            return res.status(200).json({ message: "Order deleted successfully" });
        }catch(err){
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    }
}
module.exports = adminOrderController