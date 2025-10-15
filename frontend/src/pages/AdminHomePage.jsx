import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { fetchAdminProducts } from "../redux/slices/adminProductSlice"
import { fetchAllOrders } from "../redux/slices/adminOrderSlice"
import {fetchUsers} from "../redux/slices/adminSlice"

const AdminHomePage = () => {
  const dispatch = useDispatch()
  const {
    products, 
    loading: productsLoading, 
    error: productsError
    } = useSelector((state) => state.adminProducts)

    const {orders, 
            totalOrders, 
            totalSales, 
            loading: ordersLoading, 
            error: ordersError
            } = useSelector((state) => state.adminOrders)
        
    const {
        users,
    } = useSelector((state)=>state.admin)

    useEffect(()=>{
        dispatch(fetchAdminProducts())
        dispatch(fetchAllOrders())
        dispatch(fetchUsers())

    },[dispatch])


return (
<div className="max-w-7xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
    {productsLoading || ordersLoading ? (
        <p>Loading...</p>
    ) : productsError ? (
        <p className="text-red-500">Lỗi khi tìm sản phẩm: {productsError}</p>
    ) : ordersError ?(
        <p className="text-red-500">Lỗi khi tìm kiếm đơn hàng:{ordersError}</p>
    ): (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="p-4 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold">Doanh thu</h2>
            <p className="text-2xl font-bold text-blue-500">${totalSales.toFixed(2)}</p>
        </div>
        <div className="p-4 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold">Tổng số đơn đặt hàng</h2>
            <p className="text-2xl font-bold text-blue-500">{totalOrders}</p>
            <Link to="/admin/orders" className="text-blue-500 hover:underline">
                Quản lý đơn hàng
            </Link>
        </div>
        <div className="p-4 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold">Tổng số sản phẩm</h2>
            <p className="text-2xl font-bold text-blue-500">{products.length}</p>
            <Link to="/admin/products" className="text-blue-500 hover:underline">
                Quản lý sản phẩm
            </Link>
        </div>
        <div className="p-4 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold">Tổng số Khách hàng</h2>
            <p className="text-2xl font-bold text-blue-500">{users.length}</p>
            <Link to="/admin/users" className="text-blue-500 hover:underline">
                Quản lý tài khoản
            </Link>
        </div>
    </div>
    )}


    <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Đơn đặt hàng gần đây</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full text-left text-gray-500">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                    <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Tổng giá</th>
                        <th className="py-3 px-4">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order)=>(
                            <tr key={order._id} 
                                className="border-b hover:bg-gray-50 cursor-pointer"
                            >
                                <td className="p-4">{order._id}</td>    
                                <td className="p-4">
                                    {order.user && order.user.name
                                        ? order.user.name
                                        : `Deleted User (ID: ${order.userId || "Unknown"})`}
                                </td>
                                <td className="p-4">${" "}{order.totalPrice.toFixed(2)}</td>
                                <td className="p-4">{order.status}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="p-4 text-center text-gray-500">
                                Không tìm thấy đơn hàng gần đây.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
</div> 
)
}

export default AdminHomePage
