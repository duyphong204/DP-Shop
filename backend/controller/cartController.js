const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Hàm lấy cart theo userId hoặc guestId, có populate
async function getCart(userId, guestId) {
    const filter = {};
    if (userId) filter.user = userId;
    if (guestId) filter.guestId = guestId;
    return await Cart.findOne(filter)
}

const CartController = {
    createCart: async (req, res) => {
        try {
            const { productId, quantity = 1, size, color, guestId, userId } = req.body;
            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            let cart = await getCart(userId, guestId);

            if (cart) {
                const existingProduct = cart.products.findIndex(
                    (p) => p.productId.toString() === product._id.toString() &&
                           p.size === size &&
                           p.color === color
                );

                if (existingProduct > -1) {
                    cart.products[existingProduct].quantity += Number(quantity);
                } else {
                    cart.products.push({
                        productId: product._id,
                        name: product.name,
                        image: product.images[0]?.url,
                        price: Number(product.price),
                        size,
                        color,
                        quantity: Number(quantity)
                    });
                }
                // Recalculate total price
                cart.totalPrice = cart.products.reduce((total, item) => {
                    return total + (Number(item.price) * Number(item.quantity));
                }, 0);
                await cart.save();
                return res.status(200).json({ message: "Cart updated", cart });
            } else {
                // Create a new cart for the guest or user
                const newCart = new Cart({
                    user: userId,
                    guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                    products: [{
                        productId: product._id,
                        name: product.name,
                        image: product.images[0]?.url,
                        price: Number(product.price),
                        size,
                        color,
                        quantity: Number(quantity)
                    }],
                    totalPrice: Number(product.price) * Number(quantity)
                });

                await newCart.save();
                return res.status(201).json({ message: "Cart created",newCart });
            }

        } catch (error) {
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    },
    getCart: async (req, res) => {
        try {
            const { userId, guestId } = req.query;
            const cart = await getCart(userId, guestId);

            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }

            return res.status(200).json(cart);
        } catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    },
    updateCart:async(req,res)=>{
        try{    
            const {productId,quantity,size,color,guestId,userId} = req.body;
            const cart= await getCart(userId, guestId);
            if(!cart){
                return res.status(404).json({message:"Cart not found"});
            }
            const existingProductIndex = cart.products.findIndex(
                (p) => p.productId.toString() === productId.toString() &&
                       p.size === size && 
                       p.color === color
            );
            if(existingProductIndex > -1){
                // update quantity 
               if(quantity > 0){
                    cart.products[existingProductIndex].quantity = quantity;
                }else{
                    cart.products.splice(existingProductIndex, 1); // remove product if quantity is 0
                }
                cart.totalPrice = cart.products.reduce(
                    (total, item)=> total+item.price * item.quantity, 0
                )
                await cart.save();
                return res.status(200).json(cart);
            } 
            else{
                    return res.status(404).json({message:"Product not found in cart"});
            }
        }catch(err){
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    }
};

module.exports = CartController;