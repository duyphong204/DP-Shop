import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, createReview, deleteReview } from "../../redux/slices/reviewSlice";
import { NotificationService } from "../../utils/notificationService";

const ProductReviews = ({ productId }) => {
  const dispatch = useDispatch();
  const { reviews, loading, error, avgRating } = useSelector((state) => state.reviews);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Lấy thông tin người dùng từ localStorage
  const token = localStorage.getItem("userToken");
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  // Load reviews khi component mount hoặc productId thay đổi
  useEffect(() => {
    if (productId) dispatch(fetchReviews({ productId }));
  }, [productId, dispatch]);

  // Kiểm tra user đã đánh giá sản phẩm chưa
  const myReview = reviews.find((r) => r.user._id === userInfo._id);
  const canSubmit = !myReview; // Nếu chưa đánh giá thì có thể submit

  // Xử lý gửi đánh giá
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token) return NotificationService.error("Bạn cần đăng nhập để đánh giá!");
    if (!canSubmit) return NotificationService.error("Bạn chỉ được đánh giá 1 lần");

    dispatch(createReview({ productId, reviewData: { rating, comment } }))
      .unwrap()
      .then(() => {
        NotificationService.success("Đánh giá gửi thành công");
        setRating(5);   // reset lại form
        setComment("");
      })
     // .catch((err) => NotificationService.error(err.message));
  };

  // Xử lý xóa đánh giá
  const handleDelete = (id) => {
    if (!token) return NotificationService.error("Bạn cần đăng nhập để xóa!");
    if (window.confirm("Bạn có chắc muốn xóa đánh giá này?")) {
      dispatch(deleteReview({ reviewId: id }))
        .unwrap()
        .then(() => NotificationService.success("Đã xóa đánh giá"))
        .catch((err) => NotificationService.error(err.message));
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow mt-4">

      {/* Header: tên mục đánh giá + số lượng đánh giá + rating trung bình */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
        <h2 className="text-lg sm:text-xl font-semibold truncate">Đánh giá sản phẩm</h2>
        <h2 className="text-md sm:text-lg font-semibold truncate">
          {reviews.length} đánh giá - Trung bình:{" "}
          {/* Ngôi sao màu vàng */}
          <span className="text-yellow-500">{avgRating ? avgRating.toFixed(1) : "0"} ★</span>
        </h2>
      </div>

      {/* Loading / Error */}
      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Nếu chưa có đánh giá */}
      {reviews.length === 0 && !loading && <p>Chưa có đánh giá nào.</p>}

      {/* Danh sách đánh giá */}
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r._id} className="border-b pb-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-1 sm:mb-0">
                <span className="font-semibold">{r.user.name}</span>{" "}
                <span className="text-yellow-500 text-sm sm:text-base">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </span>
              </div>
              {/* Nút xóa chỉ hiển thị với review của chính user */}
              {userInfo && r.user._id === userInfo._id && (
                <button
                  onClick={() => handleDelete(r._id)}
                  className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-0"
                >
                  Xóa
                </button>
              )}
            </div>
            <p className="text-gray-700 text-sm sm:text-base">{r.comment}</p>
            <p className="text-gray-400 text-xs">{new Date(r.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      {/* Form tạo đánh giá */}
      {token && canSubmit && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-2">
          <h3 className="font-semibold text-md sm:text-lg">Viết đánh giá</h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
            <label className="text-sm sm:text-base">Số sao:</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border px-2 py-1 rounded w-full sm:w-24 text-sm sm:text-base"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} ★</option>
              ))}
            </select>
          </div>
          <textarea
            className="w-full border p-2 rounded text-sm sm:text-base"
            placeholder="Viết nhận xét..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm sm:text-base"
          >
            Gửi đánh giá
          </button>
        </form>
      )}

      {/* Thông báo nếu user đã đánh giá */}
      {!canSubmit && token && (
        <p className="text-gray-500 mt-2 text-sm sm:text-base">Bạn đã đánh giá sản phẩm này.</p>
      )}
    </div>
  );
};

export default ProductReviews;
