import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardStats from "../components/Admin/Dashboard/DashboardStats";
import SalesChart from "../components/Admin/Dashboard/SalesChart";
import TopProducts from "../components/Admin/Dashboard/TopProducts";
import Loading from "../components/Common/Loading";

const AdminHomePage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState("daily"); // daily, monthly, yearly

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("userToken");
                if (!token) {
                    setError("Không tìm thấy token xác thực.");
                    setLoading(false);
                    return;
                }
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/admin/stats?timeRange=${timeRange}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setStats(response.data);
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
                setError("Không thể tải dữ liệu bảng điều khiển.");
                setStats({
                    totalRevenue: 0,
                    totalOrders: 0,
                    totalUsers: 0,
                    salesData: [],
                    topSellingProducts: [],
                    lowStockProducts: [],
                    topWishlistProducts: []
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [timeRange]);

    if (loading) return <Loading />
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800 whitespace-nowrap">Bảng Điều Khiển Admin</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setTimeRange("daily")}
                        className={`px-2 py-2 rounded-md ${timeRange === "daily" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Theo Ngày
                    </button>
                    <button
                        onClick={() => setTimeRange("monthly")}
                        className={`px-2 py-2 rounded-md ${timeRange === "monthly" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Theo Tháng
                    </button>
                    <button
                        onClick={() => setTimeRange("yearly")}
                        className={`px-2 py-2 rounded-md ${timeRange === "yearly" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Theo Năm
                    </button>
                </div>
            </div>

            {stats && (
                <>
                    <DashboardStats stats={stats} />
                    <SalesChart data={stats.salesData} />
                    <TopProducts
                        topSelling={stats.topSellingProducts}
                        lowStock={stats.lowStockProducts}
                        topWishlist={stats.topWishlistProducts}
                    />
                </>
            )}
        </div>
    );
};

export default AdminHomePage;
