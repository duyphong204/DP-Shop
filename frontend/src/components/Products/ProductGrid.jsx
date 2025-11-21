import { Link } from "react-router-dom";
import fallback from '../../../assets/fallback.png';
import { AiFillStar } from "react-icons/ai";
import Loading from "../Common/Loading";

const ProductGrid = ({ products, loading, error }) => {
  if (loading) return <Loading />
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <Link
          key={product._id}
          to={`/product/${product._id}`}
          className="block group"
          aria-label={product.name}
        >
          <div className="bg-white p-3 sm:p-4 rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out">

            {/* Ảnh sản phẩm */}
            <div className="w-full h-48 sm:h-64 md:h-72 lg:h-80 mb-3 sm:mb-4 overflow-hidden rounded-md">
              <img
                src={product.images?.[0]?.url || fallback}
                alt={product.images?.[0]?.altText || product.name || "Product image"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Tên sản phẩm */}
            <h3 className="text-sm md:text-base font-semibold mb-1 sm:mb-2 line-clamp-2 text-gray-900">
              {product.name}
            </h3>

            {/* Giá */}
            <p className="text-gray-700 font-bold text-sm md:text-base tracking-tight">
              ${product.price.toLocaleString()}
            </p>

            {/* Star rating */}
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <AiFillStar
                  key={i}
                  className={`w-4 h-4 ${i < (product.rating || 5) ? "text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>

          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
