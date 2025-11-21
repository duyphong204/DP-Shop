import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoupons, addCoupon, deleteCoupon, toggleCouponStatus, searchCoupon, updateCoupon, } from "../../../redux/slices/couponAdminSlice";
import { NotificationService } from "../../../utils/notificationService";
import SearchBar from "../../Common/SearchBar";
import Pagination from "../../Common/Pagination";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";

const formatDateForInput = (date) =>
  date ? new Date(date).toISOString().slice(0, 10) : "";

const buildFormState = (coupon = {}) => ({
  code: coupon.code || "",
  discountType: coupon.discountType || "percent",
  discountValue: coupon.discountValue ?? "",
  maxDiscountValue:
    coupon.discountType === "percent" ? coupon.maxDiscountValue ?? "" : "",
  minOrderValue: coupon.minOrderValue ?? "",
  usageLimit: coupon.usageLimit ?? "",
  startDate: coupon.startDate ? formatDateForInput(coupon.startDate) : "",
  endDate: coupon.endDate ? formatDateForInput(coupon.endDate) : "",
  isActive: coupon.isActive ?? true,
});

const isDuplicateCode = (coupons, code, excludeId) => {
  if (!code) return false;
  const upper = code.trim().toUpperCase();
  return coupons.some(
    (c) => c.code?.toUpperCase() === upper && c._id !== excludeId
  );
};

const CouponForm = ({ coupons, onSubmit }) => {
  const [data, setData] = useState(buildFormState());
  const [errors, setErrors] = useState({});

  const handleChange = ({ target: { name, value, type, checked } }) => {
    const nextValue = type === "checkbox" ? checked : value;

    setData((prev) => {
      const next = { ...prev, [name]: nextValue };
      if (name === "discountType" && nextValue !== "percent") {
        next.maxDiscountValue = "";
      }
      return next;
    });

    if (name === "code") {
      setErrors((prev) => ({
        ...prev,
        code: isDuplicateCode(coupons, nextValue) ? "Mã đã tồn tại" : "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.code) return;
    try {
      await onSubmit(data);
      setData(buildFormState());
      setErrors({});
    } catch {
      // thông báo đã được onSubmit xử lý
    }
  };

  return (
    <div className="p-6 rounded-lg mb-6 shadow-lg bg-white">
      <h3 className="text-lg font-bold mb-4">Thêm Mã Giảm Giá</h3>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="col-span-full">
          <input
            name="code"
            placeholder="Mã giảm giá"
            value={data.code}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          {errors.code && (
            <p className="text-red-500 text-sm mt-1">{errors.code}</p>
          )}
        </div>

        <select
          name="discountType"
          value={data.discountType}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="percent">Phần trăm (%)</option>
          <option value="fixed">Giảm cố định (VND)</option>
        </select>

        <input
          name="discountValue"
          placeholder="Giá trị giảm"
          value={data.discountValue}
          onChange={handleChange}
          type="number"
          min="1"
          className="border p-2 rounded"
          required
        />

        {data.discountType === "percent" && (
          <input
            name="maxDiscountValue"
            placeholder="Giảm tối đa (nếu %)"
            value={data.maxDiscountValue}
            onChange={handleChange}
            type="number"
            min="0"
            className="border p-2 rounded"
          />
        )}

        <input
          name="minOrderValue"
          placeholder="Đơn tối thiểu"
          value={data.minOrderValue}
          onChange={handleChange}
          type="number"
          min="0"
          className="border p-2 rounded"
        />

        <input
          name="usageLimit"
          placeholder="Số lượng người dùng"
          value={data.usageLimit}
          onChange={handleChange}
          type="number"
          min="0"
          step="1"
          className="border p-2 rounded"
        />

        <input
          type="date"
          name="startDate"
          value={data.startDate}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="date"
          name="endDate"
          value={data.endDate}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={data.isActive}
            onChange={handleChange}
          />
          <span>Kích hoạt ngay</span>
        </label>

        <button
          type="submit"
          disabled={!!errors.code}
          className={`bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 col-span-full ${errors.code ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          Thêm Mã
        </button>
      </form>
    </div>
  );
};

const CouponTable = ({ coupons, page, onToggle, onEdit, onDelete }) => (
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
          <th className="py-3 px-4">Người dùng</th>
          <th className="py-3 px-4">Bắt đầu</th>
          <th className="py-3 px-4">Kết thúc</th>
          <th className="py-3 px-4">Trạng thái</th>
          <th className="py-3 px-4">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {coupons.length ? (
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
                {coupon.usedCount || 0}/{coupon.usageLimit || "∞"}
              </td>
              <td className="p-4">{formatDateForInput(coupon.startDate)}</td>
              <td className="p-4">{formatDateForInput(coupon.endDate)}</td>
              <td className="p-4">
                <button
                  onClick={() => onToggle(coupon._id, coupon.isActive)}
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
                  onClick={() => onEdit(coupon)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                >
                  Sửa
                </button>
                <button
                  onClick={() => onDelete(coupon._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={11} className="text-center p-4 text-gray-500">
              Không có mã giảm giá nào
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const EditCouponModal = ({ open, coupon, coupons, onClose, onSubmit }) => {
  const [data, setData] = useState(buildFormState());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && coupon) {
      setData(buildFormState(coupon));
      setErrors({});
    }
  }, [open, coupon]);

  if (!open || !coupon) return null;

  const handleChange = ({ target: { name, value, type, checked } }) => {
    const nextValue = type === "checkbox" ? checked : value;
    setData((prev) => {
      const next = { ...prev, [name]: nextValue };
      if (name === "discountType" && nextValue !== "percent") {
        next.maxDiscountValue = "";
      }
      return next;
    });

    if (name === "code") {
      setErrors((prev) => ({
        ...prev,
        code: isDuplicateCode(coupons, nextValue, coupon._id)
          ? "Mã đã tồn tại"
          : "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.code) return;
    try {
      await onSubmit(coupon._id, data);
      onClose();
    } catch {
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Đóng"
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold mb-4">Chỉnh sửa mã giảm giá</h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã giảm giá
            </label>
            <input
              name="code"
              value={data.code}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại giảm
            </label>
            <select
              name="discountType"
              value={data.discountType}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="percent">Phần trăm (%)</option>
              <option value="fixed">Giảm cố định (VND)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá trị giảm
            </label>
            <input
              name="discountValue"
              type="number"
              min="1"
              value={data.discountValue}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {data.discountType === "percent" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giảm tối đa
              </label>
              <input
                name="maxDiscountValue"
                type="number"
                min="0"
                value={data.maxDiscountValue}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đơn tối thiểu
            </label>
            <input
              name="minOrderValue"
              type="number"
              min="0"
              value={data.minOrderValue}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giới hạn người dùng
            </label>
            <input
              name="usageLimit"
              type="number"
              min="0"
              step="1"
              value={data.usageLimit}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Bỏ trống để không giới hạn.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              name="startDate"
              value={data.startDate}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày kết thúc
            </label>
            <input
              type="date"
              name="endDate"
              value={data.endDate}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="isActive"
              checked={data.isActive}
              onChange={handleChange}
            />
            <span>Kích hoạt</span>
          </label>

          <div className="col-span-full flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CouponManagement = () => {
  const dispatch = useDispatch();
  const { coupons = [], loading, error, page = 1, totalPages = 1 } =
    useSelector((state) => state.coupon || {});

  const [searchTerm, setSearchTerm] = useState("");
  const searchTimer = useRef(null);
  const [modal, setModal] = useState({ open: false, coupon: null });

  useEffect(() => {
    dispatch(fetchCoupons({ page: 1 }));
  }, [dispatch]);

  const handleCreateCoupon = async (payload) => {
    try {
      await dispatch(addCoupon(payload)).unwrap();
      NotificationService.success("Thêm mã giảm giá thành công");
    } catch (err) {
      NotificationService.error(err?.message || "Thêm mã giảm giá thất bại");
      throw err;
    }
  };

  const handleUpdateCoupon = async (id, payload) => {
    try {
      await dispatch(updateCoupon({ id, couponData: payload })).unwrap();
      NotificationService.success("Cập nhật mã giảm giá thành công");
    } catch (err) {
      NotificationService.error(err?.message || "Cập nhật mã giảm giá thất bại");
      throw err;
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await dispatch(
        toggleCouponStatus({ id, isActive: !currentStatus })
      ).unwrap();
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

  const handleEditRequest = (coupon) => {
    setModal({ open: true, coupon });
  };

  if (loading) return <p className="text-center">Đang tải...</p>;
  if (error) return <p className="text-red-500 text-center">Lỗi: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col mb-6">
        <h2 className="text-2xl font-bold mb-6">Quản Lý Mã Giảm Giá</h2>
        <SearchBar onSearch={handleSearch} placeholder="Tìm mã giảm giá..." />
      </div>

      <CouponForm coupons={coupons} onSubmit={handleCreateCoupon} />

      <CouponTable
        coupons={coupons}
        page={page}
        onToggle={handleToggle}
        onEdit={handleEditRequest}
        onDelete={handleDelete}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <EditCouponModal
        open={modal.open}
        coupon={modal.coupon}
        coupons={coupons}
        onClose={() => setModal({ open: false, coupon: null })}
        onSubmit={handleUpdateCoupon}
      />
    </div>
  );
};

export default CouponManagement;

