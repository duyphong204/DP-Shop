import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { updateProduct } from "../../redux/slices/productsSlice"
import {fetchProductDetails} from "../../redux/slices/productsSlice"

const EditProductPage = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {id} = useParams()
    const {selectedProduct, loading , error} = useSelector((state) => state.products)
    const [productData , setProductData] = useState({
        name:"",
        description:"",
        price:0,
        countInStock:0,
        sku:"",
        category:"",
        brand:"",
        sizes:[],
        colors:[],
        collections:"",
        material:"",
        gender:"",
        images:[],
        })

        const [uploading, setUploading] = useState(false)
        useEffect(()=>{
            if (id){
                dispatch(fetchProductDetails(id))
            }
        },[dispatch, id])

        useEffect(()=>{
            if (selectedProduct){
                setProductData({
                    ...selectedProduct,
                    images: selectedProduct.images || [],
                    sizes: selectedProduct.sizes || [],
                    colors: selectedProduct.colors || [],
                })
            }
        },[selectedProduct])


        const handleChange = (e)=>{
            const {name,value} = e.target;
            setProductData((prevData)=>({...prevData,[name]:value}))
        }
        // remove image
        const removeImage = (idx) => {
            setProductData(prev => ({ ...prev, images: prev.images.filter((_,i)=>i!==idx) }));
        };

        const handleImageUpload = async (e) => {
            const files = Array.from(e.target.files || []);
            if (files.length === 0) return;
            setUploading(true);
            try {
                const uploads = await Promise.all(
                    files.map(async (file) => {
                        const formData = new FormData();
                        formData.append('image', file);
                        const { data } = await axios.post(
                            `${import.meta.env.VITE_API_URL}/api/upload`,
                            formData,
                            { headers: { 'Content-Type': 'multipart/form-data' } }
                        );
                        const url = data?.url || data?.imageUrl;
                        return { url, altText: file.name };
                    })
                );

                setProductData((prev) => ({
                    ...prev,
                    images: [...(prev.images || []), ...uploads.filter(img => !!img.url)],
                }));

                // reset input so the same files can be re-selected if needed
                e.target.value = null;
            } catch (error) {
                console.error("Image upload failed:", error);
            } finally {
                setUploading(false);
            }
        };

        // const handleSubmit = (e)=>{
        //     e.preventDefault()
        //    dispatch(updateProduct({id, productData}))
        //    navigate("/admin/products")
        // }
        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                await dispatch(updateProduct({ id, productData }));
                navigate("/admin/products");
            } catch (error) {
                console.error("Product update failed:", error);
            }
        };
                
        if(loading) return <p>Loading...</p>
        if(error) return <p>Error : {error}</p>
        return (
        <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
            <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
            <form onSubmit={handleSubmit}>
                {/* name  */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Product Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={productData.name} 
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2" required
                    />
                </div>
                {/* description  */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Description</label>
                    <textarea 
                        name="description" 
                        value={productData.description}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2" 
                        rows={4}
                    />
                </div>
                {/* price  */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Price</label>
                    <input type="number" 
                        name="price" 
                        value={productData.price} 
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"/>
                </div>
                {/* countInStock  */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Count In Stock</label>
                    <input type="number" 
                        name="countInStock" 
                        value={productData.countInStock} 
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"/>
                </div>
                {/* sku  */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">SKU</label>
                    <input type="text" 
                        name="sku" 
                        value={productData.sku} 
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"/>
                </div>
                {/* sizes */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">
                        Sizes (comma-separated)
                    </label>
                    <input 
                        type="text" 
                        name="sizes" 
                        value={productData.sizes.join(", ")} 
                        onChange={(e)=> setProductData({...productData, sizes:e.target.value.split(",").map((size)=>size.trim())
                        })}
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                </div>
                 {/* colors */}
                 <div className="mb-6">
                    <label className="block font-semibold mb-2">
                            Colors (comma-separated)
                    </label>
                    <input 
                        type="text" 
                        name="colors" 
                        value={productData.colors.join(", ")} 
                        onChange={(e)=> setProductData({...productData, colors:e.target.value.split(",").map((color)=>color.trim())
                        })}
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                </div>
                
                {/* image upload */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Upload Image</label>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
                    {uploading && <p>Uploading image....</p>}
                    <div className="flex gap-4 mt-4">
                        {productData.images.map((image,index) =>(
                            <div key={index} className="relative">
                                <img src={image.url} 
                                    alt={image.altText || "Product Image"}
                                    className="w-20 h-20 object-cover rounded-md shadow-md"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors">
                    Update Product
                </button>
            </form>
        </div>
    )
}

export default EditProductPage
