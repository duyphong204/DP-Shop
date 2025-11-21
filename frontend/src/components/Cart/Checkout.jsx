import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PayPalButton from "./PayPalButton";
import { createCheckout, markCheckoutAsPaid, finalizeCheckout, } from "../../redux/slices/checkoutSlice";
import { validateCoupon, clearCoupon, } from "../../redux/slices/couponUserSlice";
import { NotificationService } from "../../utils/notificationService";
import Loading from "../Common/Loading";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, loading: cartLoading, error: cartError } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { checkout: checkoutData, loading: checkoutLoading, error: checkoutError } = useSelector((state) => state.checkout);

  // THÊM: state cho coupon
  const { coupon, discountAmount, finalTotal: couponFinalTotal, loading: couponLoading, error: couponError } = useSelector(
    (state) => state.couponUser || {}
  );

  const [checkoutId, setCheckoutId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  /* Redirect nếu giỏ trống */
  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  /* Xóa coupon khi rời trang */
  useEffect(() => {
    return () => dispatch(clearCoupon());
  }, [dispatch]);

  /* Áp dụng mã giảm giá */
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    await dispatch(
      validateCoupon({
        code: couponCode.trim().toUpperCase(),
        userId: user._id,
        totalPrice: cart.totalPrice,
      })
    );
    setCouponCode(""); // reset input
  };

  /* Tạo đơn hàng – thêm couponId nếu có */
  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (isSubmitting || !cart?.products?.length) return;

    setIsSubmitting(true);
    try {
      const payload = {
        checkoutItems: cart.products,
        shippingAddress,
        paymentMethod: "PayPal",
        totalPrice: cart.totalPrice,
        ...(coupon && { couponId: coupon.id, couponCode: coupon.code }),
      };

      const result = await dispatch(createCheckout(payload)).unwrap();
      setCheckoutId(result._id);
      NotificationService.success("Tạo đơn hàng thành công!");
    } catch (err) {
      if (err?.errors && Array.isArray(err.errors)) {
        err.errors.forEach((msg) => NotificationService.error(msg));
      } else {
        NotificationService.error(err?.message || "Không thể tạo đơn hàng");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    if (!checkoutId) return;

    try {
      // Bước 1: Đánh dấu thanh toán
      await dispatch(markCheckoutAsPaid({ checkoutId, paymentDetails })).unwrap();
      NotificationService.success("Thanh toán thành công!");

      // Bước 2: Hoàn tất đơn hàng → trả về order thật
      const order = await dispatch(finalizeCheckout(checkoutId)).unwrap();

      NotificationService.success("Đơn hàng đã được xác nhận!");
      navigate("/order-confirmation");
    } catch (error) {
      const message = error?.message || "Thanh toán thất bại. Vui lòng thử lại.";
      NotificationService.error(message);
    }
  };

  const rawDiscount =
    checkoutData?.discountAmount ??
    (typeof discountAmount === "number" ? discountAmount : Number(discountAmount)) ??
    (couponFinalTotal != null ? cart.totalPrice - couponFinalTotal : 0);

  const appliedDiscount = Math.max(Number(rawDiscount) || 0, 0);

  const finalTotal =
    checkoutData?.totalPrice ??
    (couponFinalTotal != null ? couponFinalTotal : Math.max(cart.totalPrice - appliedDiscount, 0));

  const subtotal =
    checkoutData?.subtotal ??
    checkoutData?.totalBeforeDiscount ??
    cart.totalPrice;


  if (cartLoading) return <Loading />
  if (cartError) return <p className="text-center py-12 text-red-600">Lỗi: {cartError}</p>;
  if (!cart?.products?.length) return <p className="text-center py-12">Giỏ hàng của bạn trống.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* === LEFT: Checkout Form === */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold uppercase tracking-tight mb-8">Thanh toán</h2>

        {/* Hiển thị lỗi từ backend */}
        {checkoutError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            <p className="font-semibold mb-1">Không thể đặt hàng:</p>
            <ul className="list-disc list-inside text-sm mt-1">
              {Array.isArray(checkoutError)
                ? checkoutError.map((msg, i) => <li key={i}>{msg}</li>)
                : <li>{checkoutError}</li>}
            </ul>
          </div>
        )}

        <form onSubmit={handleCreateCheckout} className="space-y-6">
          {/* === Contact Info === */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Chi tiết liên hệ</h3>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full p-3 border rounded-lg bg-gray-50 cursor-not-allowed"
              />
            </div>
          </section>

          {/* === Shipping Address === */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Địa chỉ giao hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Tên</label>
                <input
                  type="text"
                  value={shippingAddress.firstName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Họ</label>
                <input
                  type="text"
                  value={shippingAddress.lastName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 font-medium mb-2">Địa chỉ</label>
              <input
                type="text"
                value={shippingAddress.address}
                onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Thành phố</label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Mã bưu chính</label>
                <input
                  type="text"
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 font-medium mb-2">Quốc gia</label>
              <input
                type="text"
                value={shippingAddress.country}
                onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 font-medium mb-2">Số điện thoại</label>
              <input
                type="tel"
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
            </div>
          </section>

          {/* === Submit Button / PayPal === */}
          <div className="mt-8">
            {!checkoutId ? (
              <button
                type="submit"
                disabled={isSubmitting || checkoutLoading}
                className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-200 
                  ${isSubmitting || checkoutLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800 active:scale-95"
                  }`}
              >
                {isSubmitting || checkoutLoading ? "Đang xử lý..." : "Tiếp tục thanh toán"}
              </button>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thanh toán qua PayPal</h3>
                <PayPalButton
                  amount={finalTotal}                     // THAY ĐỔI: dùng finalTotal (đã trừ discount)
                  onSuccess={handlePaymentSuccess}
                  onError={(err) => NotificationService.error(err?.message || "Thanh toán thất bại")}
                />
              </div>
            )}
          </div>
        </form>
      </div>

      {/* === RIGHT: Order Summary === */}
      <div className="bg-gray-50 rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h3>

        <div className="space-y-5 border-t pt-4">
          {cart.products.map((item, index) => (
            <div key={index} className="flex justify-between items-start pb-4 border-b last:border-0">
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-24 object-cover rounded-lg shadow-sm"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">Size: {item.size}</p>
                  <p className="text-sm text-gray-600">Màu: {item.color}</p>
                  <p className="text-sm text-gray-600">SL: {item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold text-lg">${item.price.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* THÊM: Ô nhập mã giảm giá */}
        <div className="mt-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Mã giảm giá"
              className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              disabled={!!checkoutId}
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={couponLoading || !!checkoutId}
              className={`px-6 py-3 rounded-lg font-medium text-white transition-all ${couponLoading || !!checkoutId
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
                }`}
            >
              {couponLoading ? "..." : "Áp dụng"}
            </button>
          </div>

          {couponError && <p className="text-red-600 mt-2 text-sm">{couponError}</p>}
          {coupon && (
            <p className="text-green-600 mt-2 font-medium">
              Đã áp dụng: {coupon.code} (-${appliedDiscount.toLocaleString()})
            </p>
          )}
        </div>

        <div className="mt-6 space-y-3 text-lg">
          <div className="flex justify-between">
            <span>Tổng phụ</span>
            <span className="font-medium">${subtotal.toLocaleString()}</span>
          </div>

          {appliedDiscount > 0 && (
            <div className="flex justify-between text-green-600 font-medium">
              <span>Giảm giá</span>
              <span>-${appliedDiscount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Vận chuyển</span>
            <span className="text-green-600">Miễn phí</span>
          </div>

          <div className="flex justify-between pt-4 border-t font-bold text-xl">
            <span>Tổng cộng</span>
            <span className="text-black">${finalTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;