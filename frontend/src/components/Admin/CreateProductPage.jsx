import React, { useState } from 'react'
import {createProduct} from "../../redux/slices/adminProductSlice"
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const CreateProductPage = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [productData,setProductData]=useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    sizes: [],
    colors: [],
    images: [],
    gender: "",       
    brand: "",       
    material: "", 
  })

  const [uploading,setUploading]=useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const uploads = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("image", file);
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/upload`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          const url = data?.url || data?.imageUrl;
          return { url, altText: file.name };
        })
      );
      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploads.filter((img) => !!img.url)],
      }));

      e.target.value = null; // reset input
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createProduct(productData)).unwrap();
      navigate("/admin/products"); // về trang danh sách sản phẩm
    } catch (error) {
      console.error("Create product failed:", error);
    }
  };


  const handleSizesColorsChange = (e, field) => {
    setProductData((prev) => ({
      ...prev,
      [field]: e.target.value.split(",").map((x) => x.trim()),
    }));
  };

  return (
   <div className='max-w-5xl  mx-auto px-6 shadow-md rounded-md'>
      <h2 className='text-3xl font-bold mb-6 text-center'>Thêm sản phẩm</h2>
      <form onSubmit={handleSubmit}>

        {/* ten san pham  */}
        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Tên sản phẩm</label>
          <input 
            name="name"
            value={productData.name}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-md p-2' 
            required />
        </div>

        {/* mo ta */}
        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Mô tả</label>
          <textarea 
            name="description" 
            value={productData.description}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-md p-2' 
            rows={4}>
          </textarea>
        </div>

        {/* category */}
        <div className="mb-4">
            <label className="block font-medium mb-2">Category</label>
            <div className="flex gap-4">
              {["Top Wear", "Bottom Wear", "Footwear", "Accessories"].map((cat) => (
                <label key={cat} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={productData.category === cat}
                    onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                    className="text-green-500 focus:ring-green-500"
                  />
                  {cat}
                </label>
              ))}
            </div>
        </div>


        {/* gia  */}
        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Giá</label>
          <input 
            type="number" 
            name = "price" 
            value={productData.price}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-md p-2'
            required 
          />
        </div>

        {/* countInStock */} 
        <div className="mb-6"> 
          <label className="block font-semibold mb-2">Count In Stock</label> 
          <input 
            type="number" 
            name="countInStock" 
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          /> 
        </div> 

        {/* sku */} 
        <div className="mb-6"> 
          <label className="block font-semibold mb-2">SKU</label> 
          <input
            value={productData.sku}
            onChange={handleChange}
            name="sku" 
            className="w-full border border-gray-300 rounded-md p-2"
            required
          /> 
        </div>

        {/* sizes */} 
        <div className="mb-6"> 
          <label className="block font-semibold mb-2"> Sizes (comma-separated) </label> 
          <input 
            type="text" 
            name="sizes" 
            value={productData.sizes.join(", ")}
            onChange={(e) => handleSizesColorsChange(e, "sizes")}
            className="w-full border border-gray-300 rounded-md p-2" 
          /> 
        </div>

        {/* colors */} 
        <div className="mb-6"> 
          <label className="block font-semibold mb-2"> Colors (comma-separated) </label> 
          <input 
            value={productData.colors.join(", ")}
            onChange={(e) => handleSizesColorsChange(e, "colors")}
            type="text" 
            name="colors" 
            className="w-full border border-gray-300 rounded-md p-2" 
          /> 
        </div>

        {/* gender */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Giới tính</label>
          <div className="flex gap-4">
            {["Men", "Women"].map((g) => (
              <label key={g} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={productData.gender === g}
                  onChange={handleChange}
                />
                {g}
              </label>
            ))}
          </div>
        </div>

         {/* brand */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Thương hiệu</label>
          <select
            name="brand"
            value={productData.brand}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">-- Chọn thương hiệu --</option>
            <option value="Urban Threads">Urban Threads</option>
            <option value="Modern Fit">Modern Fit</option>
            <option value="Street Style">Street Style</option>
            <option value="Beach Breeze">Beach Breeze</option>
          </select>
        </div>


         {/* material */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Chất liệu</label>
          <select
            name="material"
            value={productData.material}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">-- Chọn chất liệu --</option>
            <option value="Cotton">Cotton</option>
            <option value="Polyester">Polyester</option>
            <option value="Wool">Wool</option>
            <option value="Denim">Denim</option>
          </select>
        </div>

        {/* image  */}
        <div className="mb-6"> 
          <label className="block font-semibold mb-2"> Image URL </label> 
          <input 
            type="file" 
            multiple 
             onChange={handleImageUpload}
            accept="image/*"
          /> 
           {uploading && <p>Uploading image...</p>}
           <div className="flex gap-4 mt-4">
            {productData.images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={img.altText || "Product"}
                className="w-20 h-20 object-cover rounded-md shadow-md"
              />
            ))}
          </div>
        </div>

        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"> 
          Thêm Sản Phẩm 
        </button> 
      </form>
   </div>
  )
}

export default CreateProductPage