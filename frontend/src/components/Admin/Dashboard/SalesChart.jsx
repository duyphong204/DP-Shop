import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const SalesChart = ({ data }) => {
    const chartData = data || [];
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Biểu Đồ Doanh Thu & Đơn Hàng</h2>
            <div className="w-full h-[400px] min-w-0" style={{ minHeight: '400px' }}>
                <ResponsiveContainer>
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="_id"
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                            }}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="sales"
                            stroke="#4F46E5"
                            name="Doanh Thu"
                            activeDot={{ r: 8 }}
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#10B981"
                            name="Đơn Hàng"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
                {chartData.length === 0 && (
                    <p className="text-center text-gray-500 mt-4">Chưa có dữ liệu doanh thu (Đơn hàng đã thanh toán).</p>
                )}
            </div>
        </div>
    );
};

export default SalesChart;
