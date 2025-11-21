<div align="center">

# 🛍️ DP-Shop - E-Commerce Platform

### Modern Full-Stack E-Commerce Application

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Website-success?style=for-the-badge)](https://dp-shopvn.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/duyphong204/DP-Shop)

</div>

---

## 🚀 Tech Stack

### Frontend
<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

</div>

### Backend
<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

</div>

### Services & Tools
<div align="center">

![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Google AI](https://img.shields.io/badge/Google_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)
![VNPay](https://img.shields.io/badge/VNPay-0066CC?style=for-the-badge&logo=visa&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## 📋 Giới thiệu

**DP-Shop** là một nền tảng thương mại điện tử full-stack hiện đại. Dự án cung cấp đầy đủ các tính năng của một hệ thống e-commerce chuyên nghiệp với giao diện đẹp mắt, trải nghiệm người dùng mượt mà và hệ thống quản trị mạnh mẽ.

### ✨ Điểm nổi bật

- 🎨 **Giao diện hiện đại** với Tailwind CSS và responsive design
- ⚡ **Hiệu năng cao** nhờ Vite và React optimization
- 🔐 **Bảo mật** với JWT authentication và authorization
- 💳 **Thanh toán đa dạng** qua VNPay và PayPal
- 🤖 **AI Chat Support** tích hợp Google Generative AI
- 📊 **Admin Dashboard** với analytics và biểu đồ thống kê
- ☁️ **Cloud Storage** với Cloudinary cho hình ảnh

---

## 🎯 Tính năng chính

### � Người dùng

- ✅ Đăng ký, đăng nhập với JWT authentication
- 🔍 Tìm kiếm và lọc sản phẩm theo giá, màu sắc, kích thước
- 🏆 Hiển thị sản phẩm bán chạy dựa trên đánh giá
- 🛒 Quản lý giỏ hàng (thêm, sửa, xóa)
- 💰 Đặt hàng và thanh toán trực tuyến
- 📦 Theo dõi lịch sử đơn hàng
- ❤️ Danh sách yêu thích (Wishlist)
- ⭐ Đánh giá và nhận xét sản phẩm
- 🤖 Chat với AI assistant

### � Quản trị viên (Admin)

- 📊 **Dashboard Analytics** - Thống kê doanh thu, đơn hàng theo ngày/tháng/năm
- 📈 **Biểu đồ trực quan** - Sales chart với Recharts
- 🛍️ **Quản lý sản phẩm** - CRUD operations với upload ảnh Cloudinary
- 📦 **Quản lý đơn hàng** - Cập nhật trạng thái (chờ duyệt, đang giao, đã giao, hủy)
- 👤 **Quản lý người dùng** - Phân quyền Admin/User
- 🎫 **Quản lý mã giảm giá** - Tạo và quản lý coupon
- 📊 **Top Products** - Sản phẩm bán chạy, sắp hết hàng, wishlist phổ biến
- 🔐 **Phân quyền nâng cao** - Role-based access control

---

## 🛠️ Cài đặt và Chạy dự án

### Yêu cầu hệ thống

- Node.js >= 16.x
- MongoDB >= 5.x
- npm hoặc yarn

### 1️⃣ Clone repository

```bash
git clone https://github.com/duyphong204/DP-Shop.git
cd DP-Shop
```

### 2️⃣ Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend`:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
GOOGLE_API_KEY=your_google_ai_key
VNPAY_TMN_CODE=your_vnpay_code
VNPAY_HASH_SECRET=your_vnpay_secret
```

Chạy backend:

```bash
npm run dev
```

### 3️⃣ Cài đặt Frontend

```bash
cd frontend
npm install
```

Tạo file `.env.local` trong thư mục `frontend`:

```env
VITE_API_URL=http://localhost:8000
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

Chạy frontend:

```bash
npm run dev
```

### 4️⃣ Truy cập ứng dụng

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

---

## � Screenshots

### 💳 Checkout - Thanh toán
![Checkout](https://i.postimg.cc/ZRTPf4Mp/nh-ch-p-m-n-h-nh-2025-08-01-113602.png)

---

## � Demo

🔗 **Live Website**: [https://dp-shopvn.vercel.app/](https://dp-shopvn.vercel.app/)

### Test Accounts

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**User Account:**
- Email: `user@example.com`
- Password: `user123`

---

## 📁 Cấu trúc dự án

```
DP-Shop/
├── backend/
│   ├── controller/       # Controllers xử lý logic
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication & validation
│   └── index.js         # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── redux/       # Redux slices & store
    │   ├── assets/      # Images, icons
    │   └── App.jsx      # Main app component
    └── package.json
```

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Orders
- `GET /api/orders` - Lấy đơn hàng
- `POST /api/orders` - Tạo đơn hàng
- `PUT /api/orders/:id` - Cập nhật trạng thái (Admin)

### Admin Dashboard
- `GET /api/admin/stats` - Thống kê dashboard

---

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo Pull Request hoặc mở Issue nếu bạn có ý tưởng cải thiện dự án.

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

---

## 📝 License

Dự án này được phát hành dưới giấy phép MIT. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

## 👨‍💻 Tác giả

**Duy Phong**

- GitHub: [@duyphong204](https://github.com/duyphong204)
- Website: [dp-shopvn.vercel.app](https://dp-shopvn.vercel.app/)

---

<div align="center">

### ⭐ Nếu bạn thấy dự án hữu ích, hãy cho một ngôi sao nhé! ⭐

Made with ❤️ by Duy Phong

</div>