import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import hero1 from "../../../assets/rabbit-hero4.webp";
import hero2 from "../../../assets/rabbit-hero3.webp";
import hero3 from "../../../assets/rabbit-hero5.webp";

const HERO_IMAGES = [
  { src: hero1, alt: "Thời trang nam cao cấp - Bộ sưu tập mới nhất 2025" },
  { src: hero2, alt: "Phong cách hiện đại - Áo thun, polo, sơ mi nam" },
  { src: hero3, alt: "Ưu đãi đặc biệt - Giảm tới 50% cho khách hàng mới" },
];
const Hero = () => {
  return (
    <section
      aria-label="Hero banner"
      className="overflow-hidden"
    >
      <Swiper
        modules={[Autoplay]}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        speed={800}
        allowTouchMove={true}
        grabCursor={true}
        spaceBetween={0}
        slidesPerView={1}
        className="h-[35vh] md:h-[70vh] lg:h-[85vh]"
      >
        {HERO_IMAGES.map((image, index) => (
          <SwiperSlide key={index}>
            {/* WRAPPER ĐỂ ẢNH LUÔN GIỮ TỶ LỆ */}
            <div className="relative w-full h-full">
              <img
                src={image.src}
                alt={image.alt}
                className="absolute inset-0 w-full h-full object-cover will-change-transform"
                loading={index === 0 ? "eager" : "lazy"} // ẢNH ĐẦU TIÊN: TẢI NGAY
                decoding="async"
                fetchPriority={index === 0 ? "high" : "low"}
              />
              {/* OPTIONAL: Overlay gradient nhẹ */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;