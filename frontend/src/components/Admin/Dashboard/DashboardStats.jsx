import React from "react";
import { FaMoneyBillWave, FaShoppingCart, FaUser, FaBoxOpen } from "react-icons/fa";

const DashboardStats = ({ stats }) => {
    const cards = [
        {
            title: "Tổng Doanh Thu",
            value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: <FaMoneyBillWave size={24} className="text-green-600" />,
            color: "bg-green-100",
        },
        {
            title: "Tổng Đơn Hàng",
            value: stats?.totalOrders || 0,
            icon: <FaShoppingCart size={24} className="text-blue-600" />,
            color: "bg-blue-100",
        },
        {
            title: "Tổng Người Dùng",
            value: stats?.totalUsers || 0,
            icon: <FaUser size={24} className="text-purple-600" />,
            color: "bg-purple-100",
        },
        {
            title: "Sản Phẩm Sắp Hết",
            value: stats?.lowStockProducts?.length || 0,
            icon: <FaBoxOpen size={24} className="text-red-600" />,
            color: "bg-red-100",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <div className={`p-3 rounded-full ${card.color} mr-4`}>
                        {card.icon}
                    </div>
                    <div>
                        <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
                        <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
