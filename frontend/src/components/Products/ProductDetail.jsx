import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { NotificationService } from "../../utils/notificationService";
import ProductGrid from "./ProductGrid";
import ProductOptions from "./ProductOptions";
import ProductReviews from "../reviews/ProductReviews";

import { fetchProductDetails, fetchSimilarProducts } from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "../../redux/slices/wishlistSlice";

const ProductDetail = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const productFetchId = productId || id;

  // Lấy dữ liệu từ Redux
  const { selectedProduct, loading, error, similarProducts } = useSelector((state) => state.products);
  const { user, guestId } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishList);

  // State chỉ dùng cho hình ảnh & wishlist
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // 1. Fetch sản phẩm + dữ liệu liên quan
  useEffect(() => {
    if (!productFetchId) return;

    // Reset form khi chuyển sản phẩm
    setMainImage("");
    setSelectedSize("");
    setSelectedColor("");
    setQuantity(1);

    dispatch(fetchProductDetails(productFetchId));
    dispatch(fetchSimilarProducts({ id: productFetchId }));
    if (user) dispatch(fetchWishlist());
  }, [dispatch, productFetchId, user]);

  // 2. Đồng bộ trạng thái yêu thích
  useEffect(() => {
    if (!user) {
      setIsInWishlist(false);
      return;
    }
    if (Array.isArray(wishlistItems) && productFetchId) {
      setIsInWishlist(wishlistItems.some((item) => item._id === productFetchId));
    }
  }, [user, wishlistItems, productFetchId]);

  // 3. Đặt ảnh chính mặc định
  useEffect(() => {
    if (selectedProduct?.images?.[0]?.url) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  // 4. Xử lý thay đổi số lượng
  const handleQuantityChange = (action) => {
    setQuantity((prev) =>
      action === "plus" ? prev + 1 : prev > 1 ? prev - 1 : prev
    );
  };

  // 5. Thêm vào giỏ hàng 
  const handleAddToCart = async () => {
    try {
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
      NotificationService.success("Đã thêm vào giỏ hàng!");
    } catch {
      NotificationService.error("Thêm giỏ hàng thất bại!");
    }
  };

  // 6. Chuyển đổi yêu thích
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
    } catch {
      NotificationService.error("Cập nhật yêu thích thất bại!");
    }
  };

  // 7. Loading / Error / Empty
  if (loading) return <p className="text-center py-12">Loading...</p>;
  if (error) return <p className="text-center text-red-600 py-12">Error: {error}</p>;
  if (!selectedProduct) return null;

  // 8. Render giao diện
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
        {/* Bên trái: Hình ảnh */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col md:flex-row md:w-1/2">
            {/* Desktop Thumbnails */}
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProduct.images?.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  loading="lazy"
                  decoding="async"
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border transition
                    ${mainImage === image.url ? "border-black" : "border-gray-300"}`}
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
                  loading="lazy"
                  decoding="async"
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
                  loading="lazy"
                  decoding="async"
                  className={`w-20 h-20 flex-shrink-0 object-cover rounded-lg cursor-pointer border
                    ${mainImage === image.url ? "border-black" : "border-gray-300"}`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>
          </div>

          {/* Bên phải: Tùy chọn sản phẩm */}
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
              isInWishlist={isInWishlist}
              handleToggleWishlist={handleToggleWishlist}
            />
          </div>
        </div>

        {/* Đánh giá */}
        <div className="mt-10">
          <ProductReviews productId={productFetchId} user={user} />
        </div>

        {/* Sản phẩm tương tự */}
        <div className="mt-20">
          <h2 className="text-2xl text-center font-medium mb-4">You May Also Like</h2>
          <ProductGrid products={similarProducts} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;