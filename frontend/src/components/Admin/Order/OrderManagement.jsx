import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchAllOrders, updateOrderStatus, searchOrder } from "../../../redux/slices/adminOrderSlice";
import { NotificationService } from "../../../utils/notificationService";
import { BsClockFill, BsTruck } from "react-icons/bs";
import SearchBar from "../../Common/SearchBar";
import Pagination from "../../Common/Pagination";
import Loading from "../../Common/Loading";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error, page, totalPages, totalSales, totalItems, processingCount } =
    useSelector((state) => state.adminOrders);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimer, setSearchTimer] = useState(null);

  // kiểm tra quyền admin và fetch orders
  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/");
    else dispatch(fetchAllOrders({ page: 1 }));
  }, [dispatch, user, navigate]);

  // clear timer khi unmount
  useEffect(() => {
    return () => {
      if (searchTimer) clearTimeout(searchTimer);
    };
  }, [searchTimer]);

  // cập nhật trạng thái đơn
  const handleStatusChange = async (orderId, status) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, status })).unwrap();
      NotificationService.success(`Cập nhật trạng thái đơn #${orderId} thành công`);
    } catch (err) {
      NotificationService.error(err?.message || "Lỗi đơn hàng");
    }
  };

  // tìm kiếm đơn
  const handleSearch = (term) => {
    if (searchTimer) clearTimeout(searchTimer);
    const timer = setTimeout(() => {
      setSearchTerm(term);
      if (term.trim()) dispatch(searchOrder({ term: term.trim(), page: 1 }));
      else dispatch(fetchAllOrders({ page: 1 }));
    }, 500);
    setSearchTimer(timer);
  };

  // phân trang
  const handlePageChange = (newPage) => {
    if (searchTerm) dispatch(searchOrder({ term: searchTerm, page: newPage }));
    else dispatch(fetchAllOrders({ page: newPage }));
  };

  if (loading) return <Loading />
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header + search */}
      <div className="flex flex-col mb-6">
        <h2 className="text-2xl font-bold mb-6">Quản Lý Đơn Hàng</h2>
        <SearchBar onSearch={handleSearch} placeholder="Tìm Order ID, tên, email, SĐT, địa chỉ..." />
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="p-4 shadow-lg rounded-lg bg-blue-100 flex items-center gap-3">
          <BsClockFill className="text-3xl text-blue-500" />
          <div>
            <p className="text-sm font-medium">Tổng Đơn Hàng</p>
            <p className="text-2xl font-bold">{totalItems}</p>
          </div>
        </div>

        <div className="p-4 shadow-lg rounded-lg bg-green-100 flex items-center gap-3">
          <BsTruck className="text-3xl text-green-500" />
          <div>
            <p className="text-sm font-medium">Tổng Doanh Thu</p>
            <p className="text-2xl font-bold">${(totalSales ?? 0).toFixed(2)}</p>
          </div>
        </div>

        <div className="p-4 shadow-lg rounded-lg bg-yellow-100 flex items-center gap-3">
          <BsClockFill className="text-3xl text-yellow-500" />
          <div>
            <p className="text-sm font-medium">Đơn đang xử lý</p>
            <p className="text-2xl font-bold">{processingCount}</p>
          </div>
        </div>
      </div>

      {/* Bảng đơn */}
      <div className="overflow-x-auto sm:rounded-lg shadow-2xl">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700 whitespace-nowrap">
            <tr>
              <th className="py-3 px-4">STT</th>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Địa Chỉ</th>
              <th className="py-3 px-4">Tổng Tiền</th>
              <th className="py-3 px-4">Trạng Thái</th>
              <th className="py-3 px-4">Actions</th>
              <th className="py-3 px-4">Chi Tiết</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={order._id} className="border-b hover:bg-gray-50 cursor-pointer">
                  <td className="py-4 px-4 text-gray-900 font-medium whitespace-nowrap">
                    {(page - 1) * 10 + (index + 1)}
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                    #{order._id.slice(-8)}
                  </td>
                  <td className="p-4">{order.user ? order.user.name : "Khách"}</td>
                  <td className="p-4">
                    {new Intl.DateTimeFormat("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(new Date(order.createdAt))}
                  </td>
                  <td className="p-4">{order.shippingAddress.address}</td>
                  <td className="p-4">${(order.totalPrice ?? 0).toFixed(2)}</td>

                  <td className="p-4 flex items-center gap-2">
                    <span
                      className={`px-2 h-6 flex items-center justify-center rounded-full text-white text-sm ${order.status === "Processing"
                          ? "bg-yellow-500"
                          : order.status === "Shipped"
                            ? "bg-blue-500"
                            : order.status === "Delivered"
                              ? "bg-green-500"
                              : "bg-red-500"
                        }`}
                    >
                      {order.status}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="h-6 text-sm border border-gray-300 rounded-lg p-0.5 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="p-4">
                    <button
                      disabled={order.status === "Delivered"}
                      onClick={() => handleStatusChange(order._id, "Delivered")}
                      className={`px-4 py-2 rounded-2xl text-white whitespace-nowrap ${order.status === "Delivered"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                        }`}
                    >
                      Đã giao
                    </button>
                  </td>

                  <td>
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="mr-4 px-4 py-2 bg-yellow-400 hover:bg-yellow-600 rounded-2xl text-white whitespace-nowrap"
                    >
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="p-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default OrderManagement;
