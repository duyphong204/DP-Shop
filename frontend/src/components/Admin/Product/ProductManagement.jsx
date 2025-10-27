import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useMemo } from "react";
import { MdProductionQuantityLimits, MdCheckCircle, MdWarning } from "react-icons/md";
import { deleteProduct, fetchAdminProducts } from "../../../redux/slices/adminProductSlice";
import { NotificationService } from "../../../utils/notificationService";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.adminProducts);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const stats = useMemo(() => {
    const lowStock = products.filter((p) => p.countInStock < 10).length;
    const active = products.filter((p) => p.status === "active").length;
    return { lowStock, active };
  }, [products]);

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) return;
      try {
        await dispatch(deleteProduct(id)).unwrap();
        NotificationService.success("Xóa sản phẩm thành công");
      } catch (err) {
        NotificationService.error(err?.message || "Xóa sản phẩm thất bại");
      }
    },
    [dispatch]
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Quản Lý Sản Phẩm</h2>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        <div className="p-4 rounded-lg shadow-lg flex items-center justify-between bg-gradient-to-r from-blue-100 to-blue-200 hover:scale-105 transition-transform">
          <div>
            <h2 className="text-xl font-semibold">Tổng sản phẩm</h2>
            <p className="text-2xl font-bold text-blue-600">{products.length}</p>
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

      {/* Add Product Button */}
      <div className="flex justify-end mb-4">
        <Link
          to="/admin/products/create"
          className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-700 shadow-md transition"
        >
          Thêm Sản Phẩm
        </Link>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto shadow-lg sm:rounded-lg border border-gray-200">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Tên sản phẩm</th>
              <th className="py-3 px-4">Brand</th>
              <th className="py-3 px-4 whitespace-nowrap">Số lượng trong kho</th>
              <th className="py-3 px-4">Giá</th>
              <th className="py-3 px-4">Sku</th>
              <th className="py-3 px-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.length ? (
              products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50 cursor-pointer">
                  <td className="p-4">
                    <img
                      src={product.images?.[0]?.url || "/no-image.png"}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{product.name}</td>
                  <td className="p-4">{product.brand}</td>
                  <td
                    className={`p-4 ${product.countInStock < 10 ? "text-red-500 font-semibold" : ""}`}
                  >
                    {product.countInStock}
                  </td>
                  <td className="p-4">${product.price.toLocaleString()}</td>
                  <td className="p-4">{product.sku}</td>
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
    </div>
  );
};

export default ProductManagement;
