import { Link } from "react-router-dom";
import fallback from '../../../assets/fallback.png';

const ProductGrid = ({ products, loading, error }) => {
    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p>Error: {error}</p>;
    }
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, index) => (
                <Link key={index} to={`/product/${product._id}`} className="block">
                    <div className="bg-white p-3 sm:p-4 rounded-lg hover:scale-110 transition-all duration-300 ease-in-out ">
                        {/* Ảnh sản phẩm */}
                        <div className="w-full h-48 sm:h-64 md:h-72 lg:h-80 mb-3 sm:mb-4">
                            <img
                                src={product.images?.[0]?.url || fallback}
                                alt={product.images?.[0]?.altText || product.name || "No image"}
                                className="w-full h-full object-cover rounded-md"
                            />
                        </div>

                        {/* Tên sản phẩm */}
                        <h3 className="text-xs sm:text-sm md:text-base font-medium mb-1 sm:mb-2 line-clamp-2">
                            {product.name}
                        </h3>

                        {/* Giá */}
                        <p className="text-gray-600 font-semibold text-sm md:text-base tracking-tight">
                            ${product.price}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default ProductGrid;
