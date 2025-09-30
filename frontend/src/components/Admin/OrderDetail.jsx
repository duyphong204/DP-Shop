import React from 'react'

const OrderDetail = () => { 
    

    return (
     <div className='max-w-7xl mx-auto p-6'>
        <h2 className="text-2xl font-bold mb-12">Chi Tiết Đơn Hàng</h2>
        <div className="overflow-x-auto sm:rounded-lg shadow-2xl">
            <table className="min-w-full text-left text-gray-500">
                <thead className="bg-gray-200 text-xs uppercase text-gray-700">
                    <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Tên Khách</th>
                        <th className="py-3 px-4">Địa Chỉ</th>
                        <th className="py-3 px-4">Tên Sản phẩm</th>
                        <th className="py-3 px-4">Số lượng</th>
                        <th className="py-3 px-4">Màu sắc</th>
                        <th className="py-3 px-4">Size</th>
                        <th className="py-3 px-4">Trạng thái</th>
                        <th className="py-3 px-4">Tổng Tiền</th>
                    </tr>
                </thead>
                <tbody>
                        <tr className="border-b">
                            <td className="p-4">534521</td>
                            <td className="p-4">Duy Phong</td>
                            <td className="p-4">508 Đường 3/2</td>
                            <td className="p-4">Áo Polo Men</td>
                            <td className="p-4">2</td>
                            <td className="p-4">Đỏ</td>
                            <td className="p-4">M</td>
                            <td className="p-4">Đã Thanh Toán</td>
                            <td className="p-4">129$</td>
                        </tr>
                </tbody>
            </table>
        </div>
     </div>
    )
}

export default OrderDetail
