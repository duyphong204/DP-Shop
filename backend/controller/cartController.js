const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Hàm lấy cart theo userId hoặc guestId, có populate
async function getCart(userId, guestId) {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId });
    }
    return null;
}

const CartController = {
    createCart: async (req, res) => {
        try {
            const { productId, quantity, size, color, guestId, userId } = req.body;
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
                cart.totalPrice = cart.products.reduce(
                    (total, item) => total + item.price * item.quantity, 0
                );
                await cart.save();
                return res.status(200).json(cart);
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
                return res.status(201).json(newCart);
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

            return res.json(cart);
        } catch (err) {
            return res.status(500).json({ message: "Server error" });
        }
    },
    updateCart: async (req, res) => {
        try {    
            const { productId, quantity, size, color, guestId, userId } = req.body;
            const cart = await getCart(userId, guestId);
            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }
            const existingProductIndex = cart.products.findIndex(
                (p) => p.productId.toString() === productId.toString() &&
                       p.size === size && 
                       p.color === color
            );
            if (existingProductIndex > -1) {
                // update quantity 
                if (quantity > 0) {
                    cart.products[existingProductIndex].quantity = quantity;
                } else {
                    cart.products.splice(existingProductIndex, 1); // remove product if quantity is 0
                }
                cart.totalPrice = cart.products.reduce(
                    (total, item) => total + item.price * item.quantity, 0
                );
                await cart.save();
                return res.status(200).json(cart);
            } else {
                return res.status(404).json({ message: "Product not found in cart" });
            }
        } catch (err) {
            return res.status(500).json({ message: "Server error" });
        }
    },
    deleteCart: async (req, res) => {
        try {
            const { productId, size, color, guestId, userId } = req.body;
            const cart = await getCart(userId, guestId);
            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }
            const productIndex = cart.products.findIndex(
                (p) => p.productId.toString() === productId.toString() &&
                       p.size === size && 
                       p.color === color 
            );
            if (productIndex > -1) {
                cart.products.splice(productIndex, 1); // remove product from cart
                // Recalculate total price
                cart.totalPrice = cart.products.reduce(
                    (total, item) => total + (Number(item.price) * Number(item.quantity)), 0
                );
                await cart.save();
                return res.status(200).json(cart);
            } else {
                return res.status(404).json({ message: "Product not found in cart" });
            }
        } catch (err) {
            return res.status(500).json({ message: "Server error" });
        }
    },
    mergeGuestCart: async (req, res) => {
        const { guestId } = req.body;

        try {
            const guestCart = await Cart.findOne({ guestId });
            const userCart = await Cart.findOne({ user: req.user._id });

            // Nếu không có cart của guest
            if (!guestCart) {
                if (userCart) {
                    return res.status(200).json(userCart);
                }
                return res.status(404).json({ message: "Guest cart not found" });
            }

            // Nếu cart guest rỗng
            if (guestCart.products.length === 0) {
                return res.status(404).json({ message: "Guest cart is empty" });
            }

            if (userCart) {
                // Gộp sản phẩm từ guest vào user
                guestCart.products.forEach((guestItem) => {
                    const productIndex = userCart.products.findIndex(
                        (userItem) =>
                            userItem.productId.toString() === guestItem.productId.toString() &&
                            userItem.size === guestItem.size &&
                            userItem.color === guestItem.color
                    );

                    if (productIndex > -1) {
                        // Nếu đã tồn tại thì cộng dồn số lượng
                        userCart.products[productIndex].quantity += guestItem.quantity;
                    } else {
                        // Nếu chưa có thì thêm mới
                        userCart.products.push(guestItem);
                    }
                });

                // Cập nhật lại tổng giá
                userCart.totalPrice = userCart.products.reduce(
                    (total, item) => total + (Number(item.price) * Number(item.quantity)), 
                    0
                );

                await userCart.save();

                try {
                    await Cart.findOneAndDelete({ guestId });
                } catch (err) {
                    console.error("error deleting guest cart :", err);
                }

                return res.status(200).json(userCart);
            } else {
                // Nếu user chưa có cart → dùng cart guest làm cart user
                guestCart.user = req.user._id;
                guestCart.guestId = undefined;

                await guestCart.save();
                return res.status(200).json(guestCart);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "server error" });
        }
    }
};

module.exports = CartController;