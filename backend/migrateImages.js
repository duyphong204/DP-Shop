import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load biến môi trường
dotenv.config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Import model
import Product from "./models/Product.js";

const migrateImages = async () => {
  const products = await Product.find();

  for (const product of products) {
    let updated = false;

    for (let i = 0; i < product.images.length; i++) {
      const imageUrl = product.images[i].url;

      try {
        // Nếu đã là Cloudinary thì bỏ qua
        if (imageUrl.includes("res.cloudinary.com")) continue;

        console.log(`📷 Đang xử lý: ${product.name}`);

        // Upload trực tiếp từ URL
        const result = await cloudinary.uploader.upload(imageUrl, {
          folder: "products",
        });

        // Update link
        product.images[i].url = result.secure_url;
        updated = true;
      } catch (err) {
        console.error(`❌ Lỗi với ảnh ${imageUrl}:`, err.message);
      }
    }

    if (updated) {
      await product.save();
      console.log(`✅ Đã cập nhật ảnh cho: ${product.name}`);
    }
  }

  console.log("🎉 Hoàn tất migrate ảnh!");
  mongoose.disconnect();
};

migrateImages();
