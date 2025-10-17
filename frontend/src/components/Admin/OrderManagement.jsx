import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import {fetchAllOrders, updateOrderStatus} from "../../redux/slices/adminOrderSlice"
import {NotificationService} from "../../utils/notificationService"
const OrderManagement = () => {


    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {user} = useSelector((state) => state.auth)
    const {orders, loading, error} = useSelector((state) => state.adminOrders)

    useEffect(()=>{
        if(!user || user.role !== "admin"){
            navigate("/")
        }else{
            dispatch(fetchAllOrders())
        }
    },[dispatch, user, navigate])

    const handleStatusChange = async (orderId, status) => {
        try {
            await dispatch(updateOrderStatus({ id: orderId, status })).unwrap();
            NotificationService.success(`Cập nhật trạng thái đơn #${orderId} thành công`);
        } catch (err) {
            NotificationService.error(err?.message || "Lỗi đơn hàng");
        }
    };


    if(loading) return <p>Loading...</p>
    if(error) return <p>Error : {error}</p>

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-12">Quản Lý Đơn Hàng</h2>
            <div className="overflow-x-auto sm:rounded-lg shadow-2xl">
                <table className="min-w-full text-left text-gray-500">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="py-3 px-4">Order ID</th>
                            <th className="py-3 px-4">Customer</th>
                            <th className="py-3 px-4">Time</th>
                            <th className="py-3 px-4" >Địa Chỉ</th>
                            <th className="py-3 px-4">Tổng Tiền</th>
                            <th className="py-3 px-4">Trạng Thái</th>
                            <th className="py-3 px-4">Actions</th>
                            <th className="py-3 px-4">Chi Tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr 
                                    key={order._id} 
                                    className="border-b hover:bg-gray-50 cursor-pointer">
                                    <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                                        #{order._id}
                                    </td>
                                    <td className="p-4">{order.user ? order.user.name : "Khách"}</td>
                                    <td className="p-4">
                                        {new Intl.DateTimeFormat("vi-VN", { 
                                            hour: "2-digit", minute: "2-digit", 
                                            day: "2-digit", month: "2-digit", year: "numeric" 
                                        }).format(new Date(order.createdAt))}
                                    </td>
                                    <td className="p-4">{order.shippingAddress.address}</td>
                                    <td className="p-4">${order.totalPrice.toFixed(2)}</td>
                                    <td className="p-4">
                                        <select 
                                            value={order.status} 
                                            onChange={(e)=>handleStatusChange(order._id, e.target.value)}
                                            className="bg-gray-50 border border-gray-300
                                             text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <button 
                                        onClick={()=>handleStatusChange(order._id,"Delivered")}
                                        className="bg-green-500 text-white px-4 py-2 rounded-2xl hover:bg-green-600"
                                        >Đánh dấu đã giao
                                        </button>
                                    </td>
                                    <td>
                                        <div className=' mr-4 px-4 py-2 bg-yellow-400 hover:bg-yellow-600 rounded-2xl text-white'>
                                            <Link to='/admin/orders/detail'>chi tiết</Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                        <tr>
                            <td colSpan={5} className="p-4 text-center text-gray-500">No orders found.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrderManagement
