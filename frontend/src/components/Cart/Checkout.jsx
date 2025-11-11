// src/components/Cart/Checkout.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PayPalButton from "./PayPalButton";
import {
  createCheckout,
  markCheckoutAsPaid,
  finalizeCheckout,
} from "../../redux/slices/checkoutSlice";
import {
  validateCoupon,
  applyCoupon,
  clearCoupon,
} from "../../redux/slices/couponUserSlice";
import { NotificationService } from "../../utils/notificationService";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { loading: checkoutLoading } = useSelector((state) => state.checkout);
  const { coupon, discountAmount, loading: couponLoading, error: couponError } = useSelector((state) => state.couponUser);

  const [checkoutId, setCheckoutId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  // Đã dùng rồi, không còn lỗi
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "", lastName: "", address: "", city: "", postalCode: "", country: "", phone: ""
  });

  // Redirect nếu giỏ trống
  useEffect(() => {
    if (!cart?.products?.length) navigate("/");
  }, [cart, navigate]);

  // Xóa coupon khi rời trang
  useEffect(() => {
    return () => dispatch(clearCoupon());
  }, [dispatch]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    dispatch(validateCoupon({
      code: couponCode.trim().toUpperCase(),
      userId: user._id,
      totalPrice: cart.totalPrice
    }));
    setCouponCode(""); // reset input
  };

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = {
        checkoutItems: cart.products,
        shippingAddress,
        paymentMethod: "PayPal",
        totalPrice: cart.totalPrice,
        ...(coupon && { couponId: coupon.id }),
      };

      const result = await dispatch(createCheckout(payload)).unwrap();
      setCheckoutId(result._id);
      NotificationService.success("Tạo đơn hàng thành công!");

      if (coupon) {
        await dispatch(applyCoupon({
          couponId: coupon.id,
          userId: user._id,
          orderId: null
        })).unwrap();
      }
    } catch (error) { // Sửa: đổi tên từ err → error (đã dùng)
      NotificationService.error(error?.message || "Không thể tạo đơn");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      await dispatch(markCheckoutAsPaid({ checkoutId, paymentDetails })).unwrap();
      const order = await dispatch(finalizeCheckout(checkoutId)).unwrap();

      if (coupon) {
        await dispatch(applyCoupon({
          couponId: coupon.id,
          userId: user._id,
          orderId: order._id
        })).unwrap();
      }

      NotificationService.success("Đơn hàng hoàn tất!");
      navigate("/order-confirmation");
    } catch (error) { // Đã dùng error
      NotificationService.error(error?.message || "Thanh toán thất bại");
    }
  };

  const finalTotal = cart.totalPrice - discountAmount;

  return (
    <div className="max-w-7xl mx-auto p-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* LEFT: Form */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-8">Thanh toán</h2>
        <form onSubmit={handleCreateCheckout} className="space-y-6">
          {/* Contact Info */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Chi tiết liên hệ</h3>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full p-3 border rounded-lg bg-gray-50"
            />
          </section>

          {/* Shipping Address */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Địa chỉ giao hàng</h3>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Tên" required value={shippingAddress.firstName}
                onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                className="p-3 border rounded-lg" />
              <input placeholder="Họ" required value={shippingAddress.lastName}
                onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                className="p-3 border rounded-lg" />
            </div>
            <input placeholder="Địa chỉ" required value={shippingAddress.address}
              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
              className="w-full p-3 border rounded-lg mt-4" />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <input placeholder="Thành phố" required value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} />
              <input placeholder="Mã bưu chính" required value={shippingAddress.postalCode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })} />
            </div>
            <input placeholder="Quốc gia" required value={shippingAddress.country}
              onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
              className="w-full p-3 border rounded-lg mt-4" />
            <input placeholder="Số điện thoại" required value={shippingAddress.phone}
              onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
              className="w-full p-3 border rounded-lg mt-4" />
          </section>

          {/* Submit / PayPal */}
          <div className="mt-8">
            {!checkoutId ? (
              <button
                type="submit"
                disabled={isSubmitting || checkoutLoading}
                className={`w-full py-4 rounded-lg font-semibold text-white ${isSubmitting || checkoutLoading ? "bg-gray-400" : "bg-black hover:bg-gray-800"}`}
              >
                {isSubmitting ? "Đang xử lý..." : "Tiếp tục thanh toán"}
              </button>
            ) : (
              <PayPalButton amount={finalTotal} onSuccess={handlePaymentSuccess} />
            )}
          </div>
        </form>
      </div>

      {/* RIGHT: Summary */}
      <div className="bg-gray-50 rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h3>

        {cart.products.map((item) => (
          <div key={item._id} className="flex justify-between py-3 border-b">
            <div>
              <p>{item.name} x {item.quantity}</p>
              <p className="text-sm text-gray-600">{item.size} - {item.color}</p>
            </div>
            <p>${item.price.toLocaleString()}</p>
          </div>
        ))}

        {/* Coupon Input */}
        <div className="mt-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Mã giảm giá"
              className="flex-1 p-3 border rounded-lg"
              disabled={!!checkoutId}
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={couponLoading || !!checkoutId}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
            >
              {couponLoading ? "..." : "Áp dụng"}
            </button>
          </div>
          {couponError && <p className="text-red-600 mt-2">{couponError}</p>}
          {coupon && <p className="text-green-600 mt-2">Đã áp dụng: {coupon.code} (-${discountAmount.toLocaleString()})</p>}
        </div>

        <div className="mt-6 pt-6 border-t text-lg">
          <div className="flex justify-between">
            <span>Tổng phụ</span>
            <span>${cart.totalPrice.toLocaleString()}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Giảm giá</span>
              <span>-${discountAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t">
            <span>Tổng cộng</span>
            <span>${finalTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;