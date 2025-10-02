import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
//import "swiper/css/autoplay";

import hero1 from "../../../assets/rabbit-hero4.webp";
import hero2 from "../../../assets/rabbit-hero3.webp";
import hero3 from "../../../assets/rabbit-hero5.webp";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const images = [hero1, hero2, hero3];
  const navigate = useNavigate();

  const handleClick = () =>{
    navigate(`/collections/all?gender=Men`)
  }

  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      loop={true}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      //modules={[Autoplay]}
    >
      {images.map((img, idx) => (
        <SwiperSlide key={idx} className="relative">
          <img
            src={img}
            alt={`hero ${idx}`}
            className="w-full h-[35vh] md:h-[70vh] lg:h-[85vh] object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button onClick={()=>handleClick()}
                className=" hover:text-gray-950 px-4 py-2 sm:px-6 sm:py-4 
                          rounded-xl lg:text-lg font-bold text-sm shadow-lg border border-white 
                          bg-transparent hover:scale-110 hover:bg-slate-100 transition">
              MUA HÀNG
            </button>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Hero;
