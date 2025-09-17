import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        About <span className="text-pink-600">Our Shop</span>
      </h1>

      {/* Intro */}
      <p className="text-lg text-gray-600 max-w-2xl text-center mb-12">
        Chào mừng bạn đến với <span className="font-semibold">Fashionista</span>! 
        Chúng tôi là cửa hàng quần áo thời trang chuyên cung cấp các sản phẩm 
        hiện đại, trẻ trung và phù hợp với mọi phong cách. 
        Sứ mệnh của chúng tôi là mang lại sự tự tin và phong cách cho bạn mỗi ngày.
      </p>

      {/* Owner Section */}
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-2xl p-8 mb-12 hover:shadow-xl transition text-center md:text-left">
        <h2 className="text-2xl font-semibold text-pink-600 mb-2">
          Người sáng lập
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Xin chào, tôi là <span className="font-semibold">Phong</span> – chủ shop. 
          Tôi luôn tin rằng thời trang không chỉ giúp bạn đẹp hơn mà còn thể hiện phong cách sống riêng biệt. 
          Tôi mong muốn đem đến cho bạn những bộ sưu tập chất lượng, độc đáo và hợp xu hướng.
        </p>
      </div>

      {/* Sections */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Story */}
        <div className="bg-white shadow-md rounded-2xl p-8 hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">Câu chuyện</h2>
          <p className="text-gray-600 leading-relaxed">
            Được thành lập từ năm 2020, cửa hàng của chúng tôi bắt đầu từ niềm đam mê 
            với thời trang và mong muốn mang những sản phẩm chất lượng đến khách hàng Việt Nam. 
            Mỗi bộ sưu tập đều được chọn lọc kỹ lưỡng để phù hợp với xu hướng mới nhất.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white shadow-md rounded-2xl p-8 hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">Sứ mệnh</h2>
          <p className="text-gray-600 leading-relaxed">
            Chúng tôi tin rằng quần áo không chỉ để mặc, mà còn thể hiện cá tính và phong cách sống. 
            Với dịch vụ tận tâm, chúng tôi luôn mong muốn đem lại trải nghiệm mua sắm thoải mái và vui vẻ nhất.
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="mt-12 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Liên hệ với chúng tôi</h3>
        <p className="text-gray-600 mb-2">📍 508 Street 3/2, TP.HCM</p>
        <p className="text-gray-600 mb-2">📧 contact@Phong.com</p>
        <p className="text-gray-600">📞 0935452263</p>
      </div>
    </div>
  );
}
