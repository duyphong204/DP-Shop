import { useEffect, useState } from "react"
import Hero from "../components/Layout/Hero"
import FeaturedCollection from "../components/Products/FeaturedCollection"
import FeaturesSection from "../components/Products/FeaturesSection"
import GenderCollectionSection from "../components/Products/GenderCollectionSection"
import NewArrivals from "../components/Products/NewArrivals"
import ProductDetail from "../components/Products/ProductDetail"
import ProductGrid from "../components/Products/ProductGrid"
import {useDispatch, useSelector} from "react-redux"
import { fetchProductsByFilters } from "../redux/slices/productsSlice"
import axios from "axios"


const Home = () => {
  const dispatch = useDispatch()
  const {products,loading,error} = useSelector((state)=>state.products)
  const [bestSellerProduct,setBestSellerProduct] = useState(null)
  useEffect(()=>{
    // fetch products for a specific collecion 
    dispatch(fetchProductsByFilters({
      gender:"Women",
      category:"Bottom Wear",
      limit:4,
    }))
    // fetch best seller product 
  const fetchBestSeller = async() =>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/best-seller`)
      setBestSellerProduct(response.data)
    } catch (error) {
      console.error(error)
    }
  }
    fetchBestSeller()
  },[dispatch])

  return (
    <div>
        <Hero/>
        <GenderCollectionSection/>
        <NewArrivals/>
        
        {/* Best seller */}
        <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
        {bestSellerProduct ? (
          <ProductDetail productId={bestSellerProduct._id}/>) : (
          <p className="text-center">Loading best seller product.....</p>
        )}

        <div className="container mx-auto">
          <h2 className="text-xl lg:text-3xl text-center font-bold mb-4">
            Top Wears for Women 
          </h2>
          <ProductGrid products={products} loading={loading} error={error}/>
        </div>

        <FeaturedCollection/>
        <FeaturesSection/>
    </div>
  )
}

export default Home