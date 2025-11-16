import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters, fetchBestSellerProducts } from "../redux/slices/productsSlice";
import Hero from "../components/Layout/Hero";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductGrid from "../components/Products/ProductGrid";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturesSection from "../components/Products/FeaturesSection";
import ZaloChatIcon from "../components/Common/ZaloChatIcon";
import AIChat from "../components/AIChat";

const Home = () => {
  const dispatch = useDispatch();
  const { products, bestSellerProducts, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductsByFilters({
      gender: "Men",
      category: "Top Wear",
      limit: 8,
    }));
    dispatch(fetchBestSellerProducts());
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/* Best Seller Section */}
      <div className="container mx-auto my-10">
        <h2 className="text-xl lg:text-3xl text-center font-bold mb-6">
          BEST-SELLING ITEMS
        </h2>
        <ProductGrid products={bestSellerProducts} loading={loading} error={error} />
      </div>

      {/* Top Wears for Men */}
      <div className="container mx-auto my-10">
        <h2 className="text-xl lg:text-3xl text-center font-bold mb-6">
          TOP WEARS FOR MEN
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>

      <FeaturedCollection />
      <FeaturesSection />
      <AIChat/>
      <ZaloChatIcon />
    </div>
  );
};

export default Home;
