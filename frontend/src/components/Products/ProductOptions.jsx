// Tạo một component mới để chứa các tùy chọn và nút giỏ hàng
const ProductOptions = ({
    product,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    quantity,
    handleQuantityChange,
    handleAddToCart,
    isButtonDisable,
}) => {
    return (
        <>
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">{product.name}</h1>
            <p className="text-xl text-gray-500 mb-4">${product.price}</p>
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* --- Color Options --- */}
            <div className="mb-4">
                <p className="text-gray-700">Color:</p>
                <div className="flex gap-2 mt-2">
                    {product.colors.map((color) => (
                        <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-8 h-8 rounded-full border transition-all duration-200
                                ${selectedColor === color
                                    ? "ring-2 ring-offset-2 ring-black border-4 border-transparent" 
                                    : "border-gray-300 hover:ring-1 hover:ring-gray-400"}`
                            }
                            style={{
                                backgroundColor: color.toLocaleLowerCase(),
                                filter: "brightness(0.7)", // Giảm độ mờ (brightness) cho màu sắc thật hơn
                            }}
                        >
                        </button>
                    ))}
                </div>
            </div>

            {/* --- Size Options --- */}
            <div className="mb-4">
                <p className="text-gray-700">Size:</p>
                <div className="flex gap-2 mt-2">
                    {product.sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 rounded border transition duration-150
                                ${selectedSize === size
                                    ? 'bg-black text-white border-black'
                                    : 'border-gray-300 hover:border-black'}`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- Quantity Control --- */}
            <div className="mb-6">
                <p className="text-gray-700">Số Lượng :</p>
                <div className="flex items-center space-x-4 mt-2">
                    <button
                        onClick={() => handleQuantityChange("minus")}
                        className="px-3 py-1 bg-gray-200 rounded text-lg hover:bg-gray-300 transition"
                        disabled={quantity <= 1} // Disable nếu số lượng là 1
                    >
                        -
                    </button>
                    <span className="text-lg w-4 text-center">{quantity}</span>
                    <button
                        onClick={() => handleQuantityChange("plus")}
                        className="px-3 py-1 bg-gray-200 rounded text-lg hover:bg-gray-300 transition"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* --- Add To Cart Button --- */}
            <button
                onClick={handleAddToCart}
                disabled={isButtonDisable}
                className={`bg-black text-white py-3 px-6 rounded w-full mb-6 font-semibold transition-all duration-200
                    ${isButtonDisable ? "cursor-not-allowed opacity-60" : "hover:bg-gray-800"}`}
            >
                {isButtonDisable ? "Adding..." : "THÊM GIỎ HÀNG"}
            </button>

            {/* --- Đặc trưng Table --- */}
            <div className="mt-10 text-gray-700">
                <h3 className="text-xl font-bold mb-4">Đặc trưng</h3>
                <table className="w-full text-left text-sm text-gray-600">
                    <tbody>
                        <tr>
                            <td className="py-1 w-1/3">Brand:</td>
                            <td className="py-1 font-medium">{product.brand}</td>
                        </tr>
                        <tr>
                            <td className="py-1 w-1/3">Vật liệu:</td>
                            <td className="py-1 font-medium">{product.material}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ProductOptions;