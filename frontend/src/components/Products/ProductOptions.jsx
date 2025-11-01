// src/components/products/ProductOptions.jsx
import { Heart } from "lucide-react";

const ProductOptions = ({
  product,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  quantity,
  handleQuantityChange,
  handleAddToCart,
  isInWishlist,
  handleToggleWishlist,
}) => {
  // Kiểm tra sản phẩm hết hàng
  const isOutOfStock = product.countInStock <= 0;

  return (
    <div className="space-y-6">
      {/* Tên sản phẩm */}
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{product.name}</h1>

      {/* Giá */}
      <div className="flex items-center gap-3">
        <p className="text-2xl font-bold text-black">
          ${product.discountPrice ? product.discountPrice.toLocaleString() : product.price.toLocaleString()}
        </p>
        {product.discountPrice && (
          <p className="text-lg line-through text-gray-500">${product.price.toLocaleString()}</p>
        )}
      </div>

      {/* Trạng thái tồn kho */}
      <div className="text-sm">
        {isOutOfStock ? (
          <p className="text-red-600 font-bold">Sản phẩm hết hàng</p>
        ) : (
          <p className="text-green-600 font-medium">
            Còn {product.countInStock} sản phẩm
          </p>
        )}
      </div>

      {/* Mô tả ngắn */}
      <p className="text-gray-600 leading-relaxed">{product.description}</p>

      {/* Nút yêu thích */}
      <button
        onClick={handleToggleWishlist}
        className={`flex items-center gap-2 px-5 py-2 rounded-xl border transition-all duration-200
          ${isInWishlist 
            ? "bg-red-50 border-red-500 text-red-600" 
            : "border-gray-300 text-gray-700 hover:border-black"
          }`}
      >
        <Heart
          className={`w-5 h-5 transition-all duration-300
            ${isInWishlist ? "fill-red-500 stroke-red-500" : "fill-none stroke-current"}`}
        />
        <span className="font-medium">{isInWishlist ? "Đã yêu thích" : "Yêu thích"}</span>
      </button>

      {/* Chọn màu sắc */}
      <div>
        <p className="text-gray-700 font-medium mb-2">Màu sắc:</p>
        <div className="flex gap-3">
          {product.colors?.map((color) => (
            <button
              key={color}
              onClick={() => !isOutOfStock && setSelectedColor(color)}
              disabled={isOutOfStock}
              className={`w-10 h-10 rounded-full border-2 transition-all duration-200
                ${selectedColor === color ? "ring-2 ring-offset-2 ring-black border-black" : "border-gray-300"}
                ${isOutOfStock ? "opacity-50 cursor-not-allowed" : "hover:border-black"}
              `}
              style={{ backgroundColor: color.toLowerCase() }}
              aria-label={`Chọn màu ${color}`}
            />
          ))}
        </div>
      </div>

      {/* Chọn kích thước */}
      <div>
        <p className="text-gray-700 font-medium mb-2">Kích thước:</p>
        <div className="flex gap-3">
          {product.sizes?.map((size) => (
            <button
              key={size}
              onClick={() => !isOutOfStock && setSelectedSize(size)}
              disabled={isOutOfStock}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200
                ${selectedSize === size 
                  ? "bg-black text-white border-black" 
                  : "bg-white border-gray-300 text-gray-700"
                }
                ${isOutOfStock ? "opacity-50 cursor-not-allowed" : "hover:border-black"}
              `}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Số lượng – chỉ hiện khi còn hàng */}
      {!isOutOfStock && (
        <div>
          <p className="text-gray-700 font-medium mb-2">Số lượng:</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleQuantityChange("minus")}
              disabled={quantity <= 1}
              className="w-10 h-10 border rounded-lg text-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              −
            </button>
            <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
            <button
              onClick={() => handleQuantityChange("plus")}
              disabled={quantity >= product.countInStock}
              className="w-10 h-10 border rounded-lg text-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              +
            </button>
          </div>
          {quantity >= product.countInStock && (
            <p className="text-xs text-red-600 mt-1">Chỉ còn {product.countInStock} sản phẩm</p>
          )}
        </div>
      )}

      {/* Nút Thêm vào giỏ */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock || !selectedSize || !selectedColor}
        className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-200
          ${
            isOutOfStock
              ? "bg-gray-400 cursor-not-allowed"
              : !selectedSize || !selectedColor
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-black hover:bg-gray-800 active:scale-95"
          }
        `}
      >
        {isOutOfStock
          ? "SẢN PHẨM HẾT HÀNG"
          : "THÊM VÀO GIỎ HÀNG"}
      </button>

      {/* Bảng thông tin */}
      <div className="border-t pt-6 text-sm text-gray-700">
        <h3 className="font-bold text-lg mb-3">Thông tin sản phẩm</h3>
        <table className="w-full">
          <tbody>
            <tr>
              <td className="py-1 font-medium">Thương hiệu:</td>
              <td className="py-1">{product.brand}</td>
            </tr>
            {product.material && (
              <tr>
                <td className="py-1 font-medium">Chất liệu:</td>
                <td className="py-1">{product.material}</td>
              </tr>
            )}
            {product.gender && (
              <tr>
                <td className="py-1 font-medium">Dành cho:</td>
                <td className="py-1">{product.gender === "Men" ? "Nam" : "Nữ"}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductOptions;