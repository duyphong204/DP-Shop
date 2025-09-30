import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from "./PayPalButton";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import axios from "axios";
import { NotificationService } from '../../utils/notificationService';

const Checkout = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {cart ,loading ,error} = useSelector((state) => state.cart)
    const {user} = useSelector((state) => state.auth)
    const [CheckoutId,setCheckoutId]=useState(null)
    const [shippingAddress,setShippingAddress]=useState({
        firtName:"",
        lastName:"",
        address:"",
        city:"",
        postalCode:"",
        country:"",
        phone:"",
    })

    // ensure cart is loaded before proceeding 
    useEffect(() => {
        if(!cart || !cart.products || cart.products.length===0){
            navigate("/")
        }   
    },[cart, navigate])

    const handleCreateCheckout = async(e)=>{
        e.preventDefault()
        if(cart && cart.products.length > 0){
            const toastId = NotificationService.info('Đang tạo đơn hàng...');
            const res = await dispatch(createCheckout({
                checkoutItems: cart.products,
                shippingAddress,
                paymentMethod: "Paypal",
                totalPrice: cart.totalPrice,
            })
        )
        if(res.payload && res.payload._id){
            setCheckoutId(res.payload._id) // Set checkout ID if checkout was successfull 
                NotificationService.success('Tạo đơn hàng thành công');
        }
    }
 }
    const handlePaymentSuccess = async(details)=>{
        try {
        console.log("CheckoutId:", CheckoutId);
        console.log("Payment details sent:", { paymentStatus: "Paid", paymentDetails: details });
            const toastId = NotificationService.info('Đang xử lý thanh toán...');
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/checkout/${CheckoutId}/pay`,
                {paymentStatus: "Paid", paymentDetails: details},
                {
                    headers :{
                        Authorization:`Bearer ${localStorage.getItem("userToken")}`
                    }
                }
            )
        NotificationService.success('Thanh toán thành công');
        await handleFinalizeCheckout(CheckoutId)
        } catch (error) {   
            console.error(error)
            NotificationService.error('Thanh toán thất bại. Vui lòng thử lại')
        }
    }

    const handleFinalizeCheckout = async(CheckoutId)=>{
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/checkout/${CheckoutId}/finalize`,
            {},
            {
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("userToken")}`
                }
            }
        ) 
         NotificationService.success('Đơn hàng đã được xác nhận!')
         navigate("/order-confirmation")
        } catch (error) {
            console.error(error)
            NotificationService.error('Không thể xác nhận đơn hàng')
        }
    }

    if(loading) return <p>Loading cart ....</p>
    if(error) return <p>ERROR: {error}</p>
    if(!cart || !cart.products || cart.products.length===0){
        return <p>Giỏ hàng của bạn trống.</p> 
    }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
        {/* left section  */}
        <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl uppercase mb-6">Thanh toán</h2>
            <form  onSubmit={handleCreateCheckout}>
                <h3 className="text-lg mb-4">Chi tiết liên hệ</h3>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input 
                    type="email" 
                    value={user? user.email : ""} 
                    className="w-full p-2 border rounded" 
                    disabled/>
                </div>
                <h3 className="text-lg mb-4">Giao hàng</h3>

                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700">Tên</label>
                        <input 
                        type="text" 
                        value={shippingAddress.firtName}
                        onChange={(e)=>
                            setShippingAddress({...shippingAddress,firtName:e.target.value})}
                        className="w-full p-2 border rounded" 
                        required />
                    </div>

                    <div>
                        <label className="block text-gray-700">Họ</label>
                        <input 
                        type="text" 
                        value={shippingAddress.lastName}
                        onChange={(e)=>
                            setShippingAddress({...shippingAddress,lastName:e.target.value})}
                        className="w-full p-2 border rounded" 
                        required />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Địa chỉ</label>
                    <input 
                    type="text" 
                    value={shippingAddress.address} 
                    onChange={(e)=>setShippingAddress({...shippingAddress,address:e.target.value})} 
                    className="w-full p-2 border rounded" required
                    />
                </div>
                <div className="mb-4 grid  grid-cols-2 gap-4">
                <div>
                        <label className="block text-gray-700">Thành phố</label>
                        <input 
                        type="text" 
                        value={shippingAddress.city}
                        onChange={(e)=>
                            setShippingAddress({...shippingAddress,city:e.target.value})}
                        className="w-full p-2 border rounded" 
                        required />
                    </div>

                    <div>
                        <label className="block text-gray-700">Mã bưu chính</label>
                        <input 
                        type="text" 
                        value={shippingAddress.postalCode}
                        onChange={(e)=>
                            setShippingAddress({...shippingAddress,postalCode:e.target.value})}
                        className="w-full p-2 border rounded" 
                        required 
                        />
                    </div>  
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Quốc gia</label>
                    <input 
                    type="text" 
                    value={shippingAddress.country} 
                    onChange={(e)=>setShippingAddress({...shippingAddress,country:e.target.value})} 
                    className="w-full p-2 border rounded" required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Điện thoại</label>
                    <input 
                    type="text" 
                    value={shippingAddress.phone} 
                    onChange={(e)=>setShippingAddress({...shippingAddress,phone:e.target.value})} 
                    className="w-full p-2 border rounded" required
                    />
                </div>

                <div className="mt-6">
                    {!CheckoutId ? (
                        <button type="submit" className="w-full bg-black text-white py-3 rounded">
                            Tiếp tục thanh toán
                        </button> 
                        ) : (
                            <div>
                                <h3 className="text-lg mb-4">Thanh toán bằng Paypal</h3>
                                <PayPalButton 
                                amount={cart.totalPrice} 
                                onSuccess={handlePaymentSuccess}
                                onError={(err)=> alert("payment failed. Try again.")}/>
                            </div>
                    )}
                </div>
                
            </form>
        </div>
        {/* Right section  */}
        <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg mb-4">Tóm tắt đơn hàng</h3>
            <div className="border-t py-4 mb-4">
                {cart.products.map((product,index)=>(
                    <div key={index} className="flex items-start justify-between py-2 border-b ">
                        <div className="flex items-start">
                            <img src={product.image} alt={product.name} className="w-20 h-24 object-cover mr-4 "/>
                            <div>
                                <h3 className="text-md">{product.name}</h3>
                                <p className="text-gray-500 ">Size: {product.size}</p>
                                <p className="text-gray-500 ">Màu sắc: {product.color}</p>
                            </div>
                        </div>
                        <p className="text-xl">${product.price?.toLocaleString() }</p>
                    </div>
                 ))}
            </div>
            <div className="flex justify-between items-center text-lg mb-4">
                <p>Tổng phụ</p>
                <p>${cart.totalPrice?.toLocaleString()}</p>
            </div>
            <div className="flex justify-between items-center text-lg">
                <p>vận chuyển</p>
                <p>Miễn phí</p>
            </div>
            <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
                <p>Tổng cộng</p>
                <p>${cart.totalPrice?.toLocaleString()}</p>
            </div>
        </div>
    </div>
  )
}

export default Checkout