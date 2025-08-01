# 🛍️ E-Commerce MERN Stack Project

## Giới thiệu

Đây là dự án website **bán hàng trực tuyến** được xây dựng bằng MERN Stack: **MongoDB, Express.js, React (Vite), Node.js**. Ứng dụng cung cấp đầy đủ các tính năng cơ bản và nâng cao của một hệ thống thương mại điện tử hiện đại như: quản lý sản phẩm, giỏ hàng, đặt hàng và thanh toán, xác thực người dùng bằng JWT, phân quyền Admin/Khách hàng, giao diện responsive dễ sử dụng và hệ thống quản trị riêng cho Admin.

Giao diện người dùng được xây dựng bằng **React + Vite** kết hợp với **Tailwind CSS**, giúp tối ưu hiệu năng và trải nghiệm mượt mà. Backend sử dụng **Node.js + Express** với kiến trúc RESTful API, tích hợp cơ sở dữ liệu **MongoDB** và bảo mật xác thực bằng **JWT**. Ngoài ra, hệ thống hỗ trợ thanh toán trực tuyến qua **VNPay** và **PayPal**, đồng thời sử dụng **Cloudinary** để lưu trữ và xử lý hình ảnh sản phẩm.

## 🌐 Công nghệ sử dụng

- **MongoDB** – Cơ sở dữ liệu NoSQL lưu trữ người dùng, sản phẩm, đơn hàng,...
- **Express.js** – Xây dựng API backend theo chuẩn RESTful.
- **React + Vite** – Giao diện frontend hiện đại, tối ưu tốc độ tải trang.
- **Node.js** – Chạy server backend.
- **Tailwind CSS** – Thiết kế giao diện đẹp, responsive.
- **Redux Toolkit** – Quản lý state toàn cục (giỏ hàng, người dùng, đơn hàng,...).
- **JWT (JSON Web Token)** – Xác thực & phân quyền bảo mật.
- **VNPay + PayPal** – Tích hợp thanh toán trực tuyến nhanh chóng.
- **Cloudinary** – Upload & quản lý ảnh sản phẩm.

## 🚀 Tính năng chính

### 👤 Người dùng:
- Đăng ký, đăng nhập, đăng xuất với xác thực JWT.
- Tìm kiếm sản phẩm theo tên, danh mục.
- **Lọc sản phẩm theo giá, màu sắc, kích thước (size).**
- **Hiển thị sản phẩm bán chạy dựa trên số lượng đánh giá và trung bình số sao.**
- Thêm sản phẩm vào giỏ hàng, cập nhật số lượng hoặc xóa.
- Đặt hàng và thanh toán bằng VNPay hoặc PayPal.
- Xem lịch sử mua hàng, chi tiết đơn hàng.

### 🛠️ Quản trị viên (Admin):
- Thêm, sửa, xóa sản phẩm (có upload ảnh bằng Cloudinary).
- **Chỉnh sửa ảnh sản phẩm trực tiếp thông qua Cloudinary.**
- **Quản lý đơn hàng:** xác nhận đơn, đánh dấu đơn đang giao, đã giao, hủy đơn, đang chờ duyệt,...
- **Quản lý người dùng:** phân quyền người dùng thành admin hoặc khách hàng.
- Xem danh sách người dùng, xóa hoặc cập nhật thông tin.
- **Phân quyền nâng cao:** chỉ admin mới truy cập được các chức năng quản trị.
- Xem thống kê số lượng đơn hàng, doanh thu,...
- Giao diện quản trị dễ sử dụng, trực quan và phân luồng rõ ràng.

## 📸 Giao diện website

<!-- ### 🔐 Trang Login – Đăng nhập
![Login](https://i.postimg.cc/8z9hVLnp/nh-ch-p-m-n-h-nh-2025-08-01-111449.png) -->

<!-- ### 📝 Trang Register – Đăng ký
![Register](https://i.postimg.cc/3wPVPy05/nh-ch-p-m-n-h-nh-2025-08-01-112343.png)

### 🧭
![Navbar](https://i.postimg.cc/8PPKXdXf/nh-ch-p-m-n-h-nh-2025-08-01-112453.png)

### 🏠 Trang Home – Trang chủ
![Home](https://i.postimg.cc/ZKGNv4NY/nh-ch-p-m-n-h-nh-2025-08-01-112649.png)

### 🛍️ Trang Collection – Bộ sưu tập sản phẩm
![Collection](https://i.postimg.cc/fRsxgMR2/nh-ch-p-m-n-h-nh-2025-08-01-112748.png)

### 👤 Trang Profile – Thông tin cá nhân
![Profile](https://i.postimg.cc/6pzGjRSq/nh-ch-p-m-n-h-nh-2025-08-01-112831.png)

### 🛒 Trang Cart – Giỏ hàng
![Cart](https://i.postimg.cc/QdJHf1GY/nh-ch-p-m-n-h-nh-2025-08-01-112955.png)

### ⚙️ Admin Dashboard – Bảng điều khiển Admin
![Admin Dashboard](https://i.postimg.cc/WbRzjXsf/nh-ch-p-m-n-h-nh-2025-08-01-113053.png)

### 👥 User Management – Quản lý người dùng
![User management](https://i.postimg.cc/g00k47Kr/nh-ch-p-m-n-h-nh-2025-08-01-113140.png)

### 📦 Product Management – Quản lý sản phẩm
![Product management](https://i.postimg.cc/fLGzzRQ0/nh-ch-p-m-n-h-nh-2025-08-01-113240.png)

### 🛠️ Edit Product – Sửa sản phẩm
![Edit product](https://i.postimg.cc/4xfJN0qw/nh-ch-p-m-n-h-nh-2025-08-01-113322.png)

### 📬 Order Management – Quản lý đơn hàng
![Order management](https://i.postimg.cc/MGfgWb6d/nh-ch-p-m-n-h-nh-2025-08-01-113412.png) -->

### 💳 Checkout – Thanh toán
![Checkout](https://i.postimg.cc/ZRTPf4Mp/nh-ch-p-m-n-h-nh-2025-08-01-113602.png)



## ⚙️ Cài đặt và chạy dự án

### 1. Clone repo:
git clone https://github.com/ten-username/ten-repo.git
cd ten-repo
### 1. Setting frontend :
cd frontend
npm install
npm run dev
### 1. Setting backend :
cd backend
npm install
npm run dev

## 🌍 Demo
Truy cập trang web: [https://dp-shopvn.vercel.app/](https://dp-shopvn.vercel.app/)