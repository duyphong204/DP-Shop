import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdProductionQuantityLimits, MdCheckCircle, MdWarning } from "react-icons/md";
import {deleteProduct,fetchAdminProducts,searchAdminProducts,} from "../../../redux/slices/adminProductSlice";
import { NotificationService } from "../../../utils/notificationService";
import SearchBar from "../../Common/SearchBar";
import Pagination from "../../Common/Pagination";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error, page, totalPages, totalItems } = useSelector(
    (state) => state.adminProducts
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimer, setSearchTimer] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminProducts({ page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (searchTimer) clearTimeout(searchTimer);
    };
  }, [searchTimer]);

  const stats = {
    lowStock: products.filter((p) => p.countInStock < 10).length,
    active: products.filter((p) => p.status === "active").length,
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) return;
    try {
      await dispatch(deleteProduct(id)).unwrap();
      NotificationService.success("Xóa sản phẩm thành công");
    } catch (err) {
      NotificationService.error(err?.message || "Xóa sản phẩm thất bại");
    }
  };

  const handleSearch = (term) => {
    if (searchTimer) clearTimeout(searchTimer);
    const timer = setTimeout(() => {
      setSearchTerm(term);
      if (term) {
        dispatch(searchAdminProducts({ term, page: 1 }));
      } else {
        dispatch(fetchAdminProducts({ page: 1 }));
      }
    }, 500);
    setSearchTimer(timer);
  };

  const handlePageChange = (newPage) => {
    if (searchTerm) {
      dispatch(searchAdminProducts({ term: searchTerm, page: newPage }));
    } else {
      dispatch(fetchAdminProducts({ page: newPage }));
    }
  };

  if (loading) return <p className="text-center">Đang tải...</p>;
  if (error) return <p className="text-red-500 text-center">Lỗi: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col mb-6">
        <h2 className="text-2xl font-bold mb-6 whitespace-nowrap">Quản Lý Sản Phẩm</h2>
        <SearchBar onSearch={handleSearch} placeholder="Tìm Tên, SKU" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        <div className="p-4 rounded-lg shadow-lg flex items-center justify-between bg-gradient-to-r from-blue-100 to-blue-200 hover:scale-105 transition-transform">
          <div>
            <h2 className="text-xl font-semibold">Tổng sản phẩm</h2>
            <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
          </div>
          <MdProductionQuantityLimits className="text-4xl text-blue-400" />
        </div>

        <div className="p-4 rounded-lg shadow-lg flex items-center justify-between bg-gradient-to-r from-green-100 to-green-200 hover:scale-105 transition-transform">
          <div>
            <h2 className="text-xl font-semibold">Đang bán</h2>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <MdCheckCircle className="text-4xl text-green-400" />
        </div>

        <div className="p-4 rounded-lg shadow-lg flex items-center justify-between bg-gradient-to-r from-red-100 to-red-200 hover:scale-105 transition-transform">
          <div>
            <h2 className="text-xl font-semibold">Gần hết hàng</h2>
            <p className="text-2xl font-bold text-red-600">{stats.lowStock}</p>
          </div>
          <MdWarning className="text-4xl text-red-400" />
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <Link
          to="/admin/products/create"
          className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-700 shadow-md transition"
        >
          Thêm Sản Phẩm
        </Link>
      </div>

      <div className="overflow-x-auto shadow-lg sm:rounded-lg border border-gray-200">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">STT</th>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Tên sản phẩm</th>
              <th className="py-3 px-4">TIME</th>
              <th className="py-3 px-4">Brand</th>
              <th className="py-3 px-4 whitespace-nowrap">Kho</th>
              <th className="py-3 px-4">Giá</th>
              <th className="py-3 px-4">Sku</th>
              <th className="py-3 px-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.length ? (
              products.map((product, index) => (
                <tr key={product._id} className="border-b hover:bg-gray-50 cursor-pointer">
                  <td className="py-4 px-4 text-gray-900 font-medium whitespace-nowrap">
                    {(page - 1) * 10 + (index + 1)}
                  </td>

                  <td className="p-4">
                    <img
                      src={product.images?.[0]?.url || "/no-image.png"}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {new Intl.DateTimeFormat("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(new Date(product.createdAt))}
                  </td>
                  <td className="p-4">{product.brand}</td>
                  <td
                    className={`p-4 w-20 text-center ${
                      product.countInStock < 10
                        ? "text-red-500 font-bold"
                        : "text-green-600 font-bold"
                    }`}
                  >
                    {product.countInStock}
                  </td>
                  <td className="p-4">${product.price.toLocaleString()}</td>
                  <td className="p-4 whitespace-nowrap">{product.sku}</td>
                  <td className="p-4 flex">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="bg-yellow-500 text-white px-2 py-1 rounded-xl mr-2 hover:bg-yellow-600 transition"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-xl hover:bg-red-600 transition"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No Products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductManagement;
