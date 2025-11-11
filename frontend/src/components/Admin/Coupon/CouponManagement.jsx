// src/components/Admin/Coupon/CouponManagement.jsx
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCoupons,
  addCoupon,
  deleteCoupon,
  toggleCouponStatus,
  searchCoupon,
} from "../../../redux/slices/couponAdminSlice";
import { NotificationService } from "../../../utils/notificationService";
import SearchBar from "../../Common/SearchBar";
import Pagination from "../../Common/Pagination";
import { FaPercent, FaGift, FaToggleOn, FaToggleOff } from "react-icons/fa";

const initialFormData = {
  code: "",
  discountType: "percent",
  discountValue: "",
  maxDiscountValue: "",
  minOrderValue: "",
  startDate: "",
  endDate: "",
  isActive: true,
};

// Helper chuyển Date hoặc ISO string về format YYYY-MM-DD
const formatDateForInput = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
};

const CouponManagement = () => {
  const dispatch = useDispatch();
  const { coupons = [], loading, error, page = 1, totalPages = 1, totalItems = 0 } =
    useSelector((state) => state.coupon || {});

  const [formData, setFormData] = useState(initialFormData);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimer = useRef(null);

  useEffect(() => {
    dispatch(fetchCoupons({ page: 1 }));
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addCoupon(formData)).unwrap();
      NotificationService.success("Thêm mã giảm giá thành công");
      setFormData(initialFormData);
    } catch (err) {
      NotificationService.error(err?.message || "Thêm mã giảm giá thất bại");
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await dispatch(toggleCouponStatus({ id, isActive: !currentStatus })).unwrap();
      NotificationService.success("Cập nhật trạng thái mã thành công");
    } catch (err) {
      NotificationService.error(err?.message || "Cập nhật thất bại");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa mã này?")) return;
    try {
      await dispatch(deleteCoupon(id)).unwrap();
      NotificationService.success("Xóa mã giảm giá thành công");
    } catch (err) {
      NotificationService.error(err?.message || "Xóa thất bại");
    }
  };

  const handleSearch = (term) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearchTerm(term);
      if (term.trim()) {
        dispatch(searchCoupon({ term: term.trim(), page: 1 }));
      } else {
        dispatch(fetchCoupons({ page: 1 }));
      }
    }, 500);
  };

  const handlePageChange = (newPage) => {
    if (searchTerm) {
      dispatch(searchCoupon({ term: searchTerm, page: newPage }));
    } else {
      dispatch(fetchCoupons({ page: newPage }));
    }
  };

  if (loading) return <p className="text-center">Đang tải...</p>;
  if (error) return <p className="text-red-500 text-center">Lỗi: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col mb-6">
        <h2 className="text-2xl font-bold mb-6">Quản Lý Mã Giảm Giá</h2>
        <SearchBar onSearch={handleSearch} placeholder="Tìm mã giảm giá..." />
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-6 shadow-lg rounded-lg bg-blue-100 flex items-center gap-4">
          <FaGift className="text-4xl text-blue-500" />
          <div>
            <h3 className="text-lg font-semibold">Tổng Mã</h3>
            <p className="text-2xl font-bold text-blue-700">{totalItems || 0}</p>
          </div>
        </div>
        <div className="p-6 shadow-lg rounded-lg bg-green-100 flex items-center gap-4">
          <FaToggleOn className="text-4xl text-green-500" />
          <div>
            <h3 className="text-lg font-semibold">Đang Hoạt Động</h3>
            <p className="text-2xl font-bold text-green-700">
              {(coupons || []).filter((c) => c.isActive).length}
            </p>
          </div>
        </div>
        <div className="p-6 shadow-lg rounded-lg bg-red-100 flex items-center gap-4">
          <FaToggleOff className="text-4xl text-red-500" />
          <div>
            <h3 className="text-lg font-semibold">Đã Dừng</h3>
            <p className="text-2xl font-bold text-red-700">
              {(coupons || []).filter((c) => !c.isActive).length}
            </p>
          </div>
        </div>
      </div>

      {/* Form thêm coupon */}
      <div className="p-6 rounded-lg mb-6 shadow-lg bg-white">
        <h3 className="text-lg font-bold mb-4">Thêm Mã Giảm Giá</h3>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            name="code"
            placeholder="Mã giảm giá"
            value={formData.code}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <select
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="percent">Phần trăm (%)</option>
            <option value="fixed">Giảm cố định (VND)</option>
          </select>
          <input
            name="discountValue"
            placeholder="Giá trị giảm"
            value={formData.discountValue}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="maxDiscountValue"
            placeholder="Giảm tối đa (nếu %)"
            value={formData.maxDiscountValue}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="minOrderValue"
            placeholder="Đơn tối thiểu"
            value={formData.minOrderValue}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="date"
            name="startDate"
            value={formatDateForInput(formData.startDate)}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="date"
            name="endDate"
            value={formatDateForInput(formData.endDate)}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <span>Kích hoạt ngay</span>
          </label>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 col-span-full"
          >
            Thêm Mã
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">STT</th>
              <th className="py-3 px-4">Mã</th>
              <th className="py-3 px-4">Loại</th>
              <th className="py-3 px-4">Giá trị</th>
              <th className="py-3 px-4">Tối đa</th>
              <th className="py-3 px-4">Tối thiểu</th>
              <th className="py-3 px-4">Bắt đầu</th>
              <th className="py-3 px-4">Kết thúc</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {coupons && coupons.length > 0 ? (
              coupons.map((coupon, index) => (
                <tr key={coupon._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">
                    {(page - 1) * 10 + (index + 1)}
                  </td>
                  <td className="p-4 font-medium text-gray-900">{coupon.code}</td>
                  <td className="p-4">{coupon.discountType === "percent" ? "%" : "VND"}</td>
                  <td className="p-4">
                    {Number(coupon.discountValue).toLocaleString("vi-VN")}
                  </td>
                  <td className="p-4">{coupon.maxDiscountValue || "-"}</td>
                  <td className="p-4">{coupon.minOrderValue || "-"}</td>
                  <td className="p-4">
                    {formatDateForInput(coupon.startDate)}
                  </td>
                  <td className="p-4">
                    {formatDateForInput(coupon.endDate)}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggle(coupon._id, coupon.isActive)}
                      className="flex items-center gap-1"
                    >
                      {coupon.isActive ? (
                        <FaToggleOn className="text-green-500 text-2xl" />
                      ) : (
                        <FaToggleOff className="text-red-500 text-2xl" />
                      )}
                      {coupon.isActive ? "Hoạt động" : "Dừng"}
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center p-4 text-gray-500">
                  Không có mã giảm giá nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default CouponManagement;
