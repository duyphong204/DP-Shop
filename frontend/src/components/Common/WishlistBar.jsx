import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchWishlist, removeFromWishlist } from "../../redux/slices/wishlistSlice";
import { IoMdClose } from "react-icons/io";
import fallback from '../../../assets/fallback.png'

const WishlistBar = ({ toggleWishlist, setToggleWishlist }) => {
  const dispatch = useDispatch();
  const { items: wishlist, loading } = useSelector((state) => state.wishList);
  const dropdownRef = useRef();

  // Lấy danh sách wishlist khi mở
  useEffect(() => {
    if (toggleWishlist) {
      dispatch(fetchWishlist());
    }
  }, [toggleWishlist, dispatch]);

  // Đóng khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setToggleWishlist(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setToggleWishlist]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist({ productId }));
  };

  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[28rem] h-full
      bg-white shadow-lg transform transition-transform duration-300 z-50 flex flex-col
      ${toggleWishlist ? "translate-x-0" : "translate-x-full"}`}
      ref={dropdownRef}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Danh sách yêu thích</h2>
        <button onClick={() => setToggleWishlist(false)}>
          <IoMdClose className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Nội dung */}
      <div className="flex-grow p-4 overflow-y-auto">
        {loading ? (
          <p className="text-gray-500">Đang tải...</p>
        ) : wishlist.length === 0 ? (
          <p className="text-gray-500">Chưa có sản phẩm yêu thích</p>
        ) : (
          <div className="flex flex-col gap-3">
            {wishlist.map((item,index) => (
              <div key={item._id ?? index}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image || fallback}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded"
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.price}₫</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <IoMdClose />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistBar;
