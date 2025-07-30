const Checkout=require("../models/Checkout");
const Cart = require("../models/Cart");
const Order = require('../models/Order'); 

const checkoutController = {
    createCheckoutSession : async(req,res)=>{
        try{    
             const {checkoutItems,shippingAddress,paymentMethod,totalPrice}=req.body
             if(!checkoutItems || checkoutItems.length === 0){
                return res.status(400).json({message:"No items to checkout"});
             }
            // create a new checkout session
            const newCheckout=await Checkout.create({
                user: req.user._id,
                checkoutItems,
                shippingAddress,
                paymentMethod,
                totalPrice,
                paymentStatus: "Pending",
                isPaid: false,
            })
        console.log(`Checkout created for user: ${req.user._id}`);
        return res.status(202).json(newCheckout)
        }catch(err){
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    },
    markAsPaid : async(req,res)=>{
        try{
            const {paymentStatus,paymentDetails} = req.body;
            console.log("Received payment data:", { paymentStatus, paymentDetails })
            const checkout = await Checkout.findById(req.params.id);
            if (!checkout) {
                return res.status(404).json({ message: "Checkout not found" });
            }
            if(paymentStatus=== "Paid"){
                checkout.isPaid = true;
                checkout.paymentStatus = paymentStatus;
                checkout.paymentDetails = paymentDetails; // store payment-related details
                checkout.paidAt = Date.now()
                await checkout.save();

                res.status(200).json(checkout);
            }else{
                return res.status(400).json({ message: `Invalid payment status: ${paymentStatus}` });    
            }
        }catch(err){
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    },
    finalizeCheckout : async(req,res)=>{
        try{
            const checkout = await Checkout.findById(req.params.id);
            if (!checkout) {
                return res.status(404).json({ message: "Checkout not found" });
            }
            if (checkout.isPaid && !checkout.isFinalized) {
                // Create final order based on the checkout details
                const finalOrder = await Order.create({
                    user: checkout.user,
                    orderItems: checkout.checkoutItems,
                    shippingAddress: checkout.shippingAddress,
                    paymentMethod: checkout.paymentMethod,
                    totalPrice: checkout.totalPrice,
                    isPaid: true,
                    paidAt: checkout.paidAt,
                    isDelivered: false,
                    paymentStatus: "Paid",
                    paymentDetails: checkout.paymentDetails
                });
                // Mark the checkout as finalized
                checkout.isFinalized = true;
                checkout.finalizedAt = Date.now();
                await checkout.save();
                // delete the cart associated with the user
                await Cart.findOneAndDelete({ user: checkout.user });
                return res.status(201).json(finalOrder);
            }else if (checkout.isFinalized) {
                  return res.status(400).json({ message: "Checkout already finalized" });
            }else{
                return res.status(400).json({ message: "Checkout not paid yet" });
            }
        }catch(err){
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    }
}
module.exports = checkoutController;