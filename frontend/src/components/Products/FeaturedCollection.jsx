import { Link } from "react-router-dom"
import Featured from "../../../assets/featured1.webp"
const FeaturedCollection = () => {
  return (
    <section className="py-16 px-4 lg:px-0 ">
        <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-green-100 rounded-3xl">
            {/* left content */}
            <div className="lg:w-1/2 lg:p-8 p-6 text-center lg:text-left">
                <h2 className="text-sm lg:text-2xl font-semibold text-gray-700 mb-2">
                    Tiện lợi - Phong cách - Chất lượng
                </h2>
                <h2 className="text-xl lg:text-5xl font-bold mb-4">
                    Trang phục nổi bật
                </h2>
                <p className="text-sm lg:text-xl text-gray-600 mb-6">
                Khám phá những bộ trang phục chất lượng cao, thoải mái, kết hợp hoàn hảo giữa thời trang và công năng.
                Được thiết kế để bạn trông thật xinh đẹp và cảm thấy tự tin mỗi ngày.
                </p>
                <Link to="/collections/all" className="bg-black text-white px-6 py-3 rounded-xl text-sm border-2 border-black
                hover:bg-transparent hover:text-black transition-all duration-300 opacity-100  ease-in-out hover:font-bold hover:shadow-lg">Shop now !
                </Link>
            </div>
            {/* right content */}
            <div className="lg:w-1/2">
                <img 
                src={Featured} 
                alt="Featured collection" 
                className="w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl rounded-xl" />
            </div>
        </div>
    </section>
  )
}

export default FeaturedCollection