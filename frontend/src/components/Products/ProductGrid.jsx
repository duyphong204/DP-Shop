import { Link } from "react-router-dom";
import fallback from '../../../assets/fallback.png'
const ProductGrid = ({products,loading ,error}) => {
    if(loading){
        return <p>Loading...</p>
    }
    if(error){
        return <p>Error: {error}</p>
    }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  gap-6">
        {products.map((product,index)=>(
            <Link key={index} to={`/product/${product._id}`} className="block">
                <div className="bg-white p-4 rounded-lg">
                    <div className="w-full h-96 mb-4">
                        <img
                            src={product.images?.[0]?.url || fallback}
                            alt={product.images?.[0]?.altText || product.name || "No image"}
                            className="w-full h-full object-cover rounded-2xl"
                        />
                    </div>
                    <h3 className="text-sm mb-2">{product.name}</h3>
                    <p className="text-gray-500 font-medium text-sm tracking-tighter">${product.price}</p>
                </div>
            </Link>
        ))}
    </div>
  )
}

export default ProductGrid