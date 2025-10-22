import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { NotificationService } from "../../utils/notificationService";
import ProductGrid from "./ProductGrid";
import ProductOptions from "./ProductOptions"; 
import ProductReviews from "../reviews/ProductReviews";

import { fetchProductDetails, fetchSimilarProducts } from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { Heart } from "lucide-react";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "../../redux/slices/wishlistSlice";


const ProductDetail = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Lấy dữ liệu từ Redux store
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishList);

  // State local cho component
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisable, setIsButtonDisable] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);


  const productFetchId = productId || id;

  // --- Lấy dữ liệu sản phẩm và sản phẩm tương tự khi productId thay đổi ---
  useEffect(() => {
    // Reset lại state khi chuyển sản phẩm khác
    setMainImage('');
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);

    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
      if (user) {
        dispatch(fetchWishlist());
      }
    }
  }, [dispatch, productFetchId, user]);

  // ---Kiểm tra wishlistItems là mảng trước khi gọi .some()
    useEffect(() => {
      if (!user) {
        setIsInWishlist(false); // reset khi logout
      } else if (Array.isArray(wishlistItems) && productFetchId) {
        const isProductInWishlist = wishlistItems.some(item => item._id === productFetchId);
        setIsInWishlist(isProductInWishlist);
      }
    }, [user, wishlistItems, productFetchId]);


  // --- Đặt ảnh chính (main image) là ảnh đầu tiên ---
  useEffect(() => {
    if (selectedProduct && selectedProduct.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  // --- Thay đổi số lượng sản phẩm ---
  const handleQuantityChange = useCallback((action) => {
    setQuantity((prev) => {
      if (action === "plus") return prev + 1;
      if (action === "minus" && prev > 1) return prev - 1;
      return prev;
    });
  }, []);

  // --- Thêm sản phẩm vào giỏ hàng ---
  const handleAddToCart = async () => {
    // Kiểm tra đã chọn size & màu chưa
    if (!selectedSize || !selectedColor) {
      NotificationService.warning("Vui lòng chọn Size & màu sắc.");
      return;
    }

    try {
      setIsButtonDisable(true);
      await dispatch(
        addToCart({
          productId: productFetchId,
          quantity,
          size: selectedSize,
          color: selectedColor,
          guestId,
          userId: user?._id,
        })
      ).unwrap();
      NotificationService.success("Sản phẩm đã được thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Add to cart lỗi:", error);
      NotificationService.error("Thêm giỏ hàng thất bại!");
    } finally {
      setIsButtonDisable(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      NotificationService.warning("Vui lòng đăng nhập để yêu thích.");
      return;
    }
    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist({ productId: productFetchId })).unwrap();
      } else {
        await dispatch(addToWishlist({ productId: productFetchId })).unwrap();
      }
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error("Wishlist error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      NotificationService.error(error.message || "Lỗi khi cập nhật danh sách yêu thích!");
    }
  };

  // --- Render loading / error ---
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!selectedProduct) return null;

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">

        {/* ===== PHẦN BÊN TRÁI: Thumbnails + Main Image ===== */}
        <div className="flex flex-col md:flex-row">

          <div className="flex flex-col md:flex-row md:w-1/2">

            {/* Desktop Thumbnails */}
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProduct.images?.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border transition
                    ${mainImage === image.url ? 'border-black' : 'border-gray-300'}`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="md:flex-1">
              {mainImage && (
                <img
                  src={mainImage}
                  alt="Main product"
                  className="w-full h-auto object-cover rounded-lg"
                />
              )}
            </div>

            {/* Mobile Thumbnails */}
            <div className="md:hidden flex overflow-x-scroll space-x-4 mt-4 pb-4">
              {selectedProduct.images?.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Thumbnail ${index}`}
                  className={`w-20 h-20 flex-shrink-0 object-cover rounded-lg cursor-pointer border
                    ${mainImage === image.url ? 'border-black' : 'border-gray-300'}`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>

          </div>

          {/* ===== PHẦN BÊN PHẢI: Product Options & Details ===== */}
          <div className="md:w-1/2 md:ml-10">
            <ProductOptions
              product={selectedProduct}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              quantity={quantity}
              handleQuantityChange={handleQuantityChange}
              handleAddToCart={handleAddToCart}
              isButtonDisable={isButtonDisable}
              isInWishlist={isInWishlist}
              handleToggleWishlist={handleToggleWishlist}
            />
          </div>

        </div>

        {/* ===== PHẦN ĐÁNH GIÁ ===== */}
        <div className="mt-10">
          <ProductReviews productId={productFetchId} user={user} />
        </div>

        {/* ===== You May Also Like (Sản phẩm tương tự) ===== */}
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
