import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { NotificationService } from "../../utils/notificationService";
import ProductGrid from "./ProductGrid";
import { fetchProductDetails, fetchSimilarProducts } from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const ProductDetail = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();

  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);

  // UI state
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Fetch data
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
      dispatch(fetchSimilarProducts({ id: productId }));
    }
  }, [dispatch, productId]);

  // Cập nhật các lựa chọn mặc định khi sản phẩm thay đổi
  useEffect(() => {
    if (!selectedProduct) return;

    if (selectedProduct.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
    if (selectedProduct.sizes?.length > 0 && !selectedSize) {
      setSelectedSize(selectedProduct.sizes[0]);
    }
    if (selectedProduct.colors?.length > 0 && !selectedColor) {
      setSelectedColor(selectedProduct.colors[0]);
    }
  }, [selectedProduct]);

  // Handlers
  const handleQuantityChange = useCallback(
    (action) => {
      setQuantity((prev) => {
        if (action === "plus") return prev + 1;
        if (action === "minus" && prev > 1) return prev - 1;
        return prev;
      });
    },
    []
  );

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      NotificationService.warning("Vui lòng chọn đầy đủ size và màu sắc!");
      return;
    }

    setIsButtonDisabled(true);
    try {
      await dispatch(
        addToCart({
          productId,
          quantity,
          size: selectedSize,
          color: selectedColor,
          guestId,
          userId: user?._id,
        })
      );
      NotificationService.success("Sản phẩm đã được thêm vào giỏ hàng!");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  // Render states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!selectedProduct) return null;

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
        <div className="flex flex-col md:flex-row">
          {/* Left thumbnails */}
          <div className="hidden md:flex flex-col space-y-4 mr-6">
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Thumbnail ${index}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                  mainImage === image.url ? "border-black" : "border-gray-300"
                }`}
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>

          {/* Main image */}
          <div className="md:w-1/2">
            {mainImage && (
              <img
                src={mainImage}
                alt="Main product"
                className="w-full h-auto object-cover rounded-lg mb-4"
              />
            )}
          </div>

          {/* trên Mobile */}
          <div className="md:hidden flex overflow-x-scroll space-x-4 mb-4">
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Thumbnail ${index}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                  mainImage === image.url ? "border-black" : "border-gray-300"
                }`}
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>

          {/* Right details */}
          <div className="md:w-1/2 md:ml-10">
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">
              {selectedProduct.name}
            </h1>
            {selectedProduct.originalPrice && (
              <p className="text-gray-600 text-lg mb-1 line-through">
                ${selectedProduct.originalPrice}
              </p>
            )}
            <p className="text-xl text-gray-800 mb-2">${selectedProduct.price}</p>
            <p className="text-gray-600 mb-4">{selectedProduct.description}</p>

            {/* Color */}
            <div className="mb-4">
              <p className="text-gray-700 font-bold">Color:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border ${
                      selectedColor === color 
                        ? "border-4 border-white ring-2 ring-black "
                        : "border-gray-600"
                    }`}
                    style={{
                      backgroundColor: color.toLowerCase(),
                      filter: "brightness(0.5)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-4">
              <p className="text-gray-700 font-bold">Size:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded border ${
                      selectedSize === size ? "bg-black text-white" : ""
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Số lượng */}
            <div className="mb-6">
              <p className="text-gray-700 font-bold">Số lượng:</p>
              <div className="flex items-center space-x-4 mt-2">
                <button
                  onClick={() => handleQuantityChange("minus")}
                  className="px-2 py-1 bg-gray-200 rounded text-lg"
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("plus")}
                  className="px-2 py-1 bg-gray-200 rounded text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
                isButtonDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-900"
              }`}
            >
              {isButtonDisabled ? "Adding..." : "THÊM VÀO GIỎ HÀNG"}
            </button>

            {/* Characteristics */}
            <div className="mt-10 text-gray-700">
              <h3 className="text-xl font-bold mb-4">Đặc trưng</h3>
              <table className="w-full text-left text-sm text-gray-600">
                <tbody>
                  <tr>
                    <td className="py-1">Brand:</td>
                    <td className="py-1">{selectedProduct.brand}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Vật liệu:</td>
                    <td className="py-1">{selectedProduct.material}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Similar products */}
        <div className="mt-20">
          <h2 className="text-2xl text-center font-medium mb-4">
            You May Also Like
          </h2>
          <ProductGrid
            products={similarProducts}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
