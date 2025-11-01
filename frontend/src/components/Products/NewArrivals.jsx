// src/components/NewArrivals.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, FreeMode } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import fallback from "../../../assets/fallback.png";
import "swiper/css";
const NewArrivals = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products/new-arrivals`)
      .then((res) => setProducts(res.data))
      .catch(() => {});
  }, []);
  //Chỉ bật loop nếu có >= 3 sản phẩm
  const hasEnoughSlides = products.length >= 3;

  return (
    <section className="py-10 lg:py-14">
      <div className="container mx-auto px-4">
        {/* Tiêu đề */}
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            SẢN PHẨM MỚI 
          </h2>
          <p className="text-sm lg:text-base text-gray-600 mt-2 max-w-xl mx-auto">
            <span className="font-semibold text-red-500">Hot trend 2025</span> – 
            Cập nhật ngay hôm nay, dẫn đầu phong cách ngày mai.
          </p>
        </div>

        {/* Nút điều hướng */}
        <div className="flex justify-end mb-6 lg:mb-8">
          <div className="hidden lg:flex gap-2">
            <button
              id="prev"
              className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              id="next"
              className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Swiper – GIỚI HẠN CHIỀU RỘNG */}
        <Swiper
          modules={[Navigation, Autoplay, FreeMode]}
          navigation={{ prevEl: "#prev", nextEl: "#next" }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={hasEnoughSlides} // Tránh lỗi loop khi ít slide
          freeMode={{ enabled: true, momentum: true }}
          grabCursor={true} // Con trỏ tay khi kéo
          spaceBetween={16}
          slidesPerView="auto"
          lazy={{ enabled: true, loadPrevNext: true }} // <-- sửa
          className="!overflow-hidden"
        >

          {products.map((p) => (
            <SwiperSlide
              key={p._id}
              className="!w-[80%] sm:!w-[50%] lg:!w-[30%] !h-auto"
            >
              <Link to={`/product/${p._id}`} className="block group">
                <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-2xl overflow-hidden bg-gray-50">
                  <img
                    src={p.images?.[0]?.url || fallback}
                    alt={p.images?.[0]?.altText || p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    New
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-white font-medium text-sm line-clamp-2">
                      {p.name}
                    </h3>
                    <p className="text-white font-semibold text-sm mt-1">
                      ${p.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default NewArrivals;