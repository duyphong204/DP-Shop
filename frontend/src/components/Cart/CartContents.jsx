// src/components/cart/CartContent.jsx
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { removeFromCart, updateCartItemQuantity } from "../../redux/slices/cartSlice";

const CartContent = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  // Tăng/giảm số lượng
  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          size,
          color,
          userId,
          guestId,
        })
      );
    }
  };

  // Xóa sản phẩm
  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, size, color, userId, guestId }));
  };

  if (!cart?.products?.length) return <p className="text-center py-8">Giỏ hàng trống</p>;
  
  return (
    <div>
      {cart.products.map((product) => (
        <div
          key={`${product.productId}-${product.size}-${product.color}`} 
          className="flex items-start justify-between py-4 border-b"
        >
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 object-cover mr-4 rounded"
              loading="lazy"
            />
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-500">
                Size: {product.size} | Màu: {product.color}
              </p>
              <div className="flex items-center mt-2">
                <button
                  onClick={() =>
                    handleAddToCart(product.productId, -1, product.quantity, product.size, product.color)
                  }
                  className="border rounded px-2 py-1 text-xl font-medium hover:bg-gray-50"
                >
                  -
                </button>
                <span className="mx-4 font-semibold">{product.quantity}</span>
                <button
                  onClick={() =>
                    handleAddToCart(product.productId, 1, product.quantity, product.size, product.color)
                  }
                  className="border rounded px-2 py-1 text-xl font-medium hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">${product.price.toLocaleString()}</p>
            <button
              onClick={() => handleRemoveFromCart(product.productId, product.size, product.color)}
              className="mt-2 text-red-600 hover:text-red-800"
            >
              <RiDeleteBin3Line className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContent;