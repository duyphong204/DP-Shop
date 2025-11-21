import React from "react";

const TopProducts = ({ topSelling, lowStock, topWishlist }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Top sản phẩm bán chạy */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Sản Phẩm Bán Chạy</h3>
                <ul className="space-y-4">
                    {topSelling.map((product) => (
                        <li key={product._id} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded-md mr-3"
                                />
                                <div>
                                    <p className="text-sm font-medium text-gray-800 truncate w-32">
                                        {product.name}
                                    </p>
                                    <p className="text-xs text-gray-500">Đã bán: {product.totalSold}</p>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-green-600">
                                ${product.revenue.toLocaleString()}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Sắp hết hàng */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Sản Phẩm Sắp Hết</h3>
                <ul className="space-y-4">
                    {lowStock.map((product) => (
                        <li key={product._id} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img
                                    src={product.images[0]?.url}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded-md mr-3"
                                />
                                <div>
                                    <p className="text-sm font-medium text-gray-800 truncate w-32">
                                        {product.name}
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-red-600">
                                SL: {product.countInStock}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Top sản phẩm yêu thích */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Sản Phẩm Được Yêu Thích</h3>
                <ul className="space-y-4">
                    {topWishlist.map((product) => (
                        <li key={product._id} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded-md mr-3"
                                />
                                <div>
                                    <p className="text-sm font-medium text-gray-800 truncate w-32">
                                        {product.name}
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-purple-600">
                                {product.count} lượt thích
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TopProducts;
