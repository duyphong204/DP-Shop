export const validateCheckout = (req, res, next) => {

    const { checkoutItems, shippingAddress, totalPrice } = req.body;

    // 2. KIỂM TRA SẢN PHẨM, TỔNG GIÁ VÀ TỒN TẠI ĐỊA CHỈ 
    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ message: "Không có sản phẩm nào trong giỏ hàng." });
    }
    if (!totalPrice || typeof totalPrice !== 'number' || totalPrice <= 0) {
         return res.status(400).json({ message: "Tổng giá trị đơn hàng không hợp lệ." });
    }
    if (!shippingAddress) {
        return res.status(400).json({ message: "Thông tin địa chỉ giao hàng là bắt buộc." });
    }
    

    // Khai báo biến sau khi đã kiểm tra sự tồn tại của shippingAddress
    const postalCode = shippingAddress.postalCode.trim();

    // Mã Bưu chính
    const postalCodeRegex = /^\d{6}$/; 
    if (!postalCodeRegex.test(postalCode)) {
        return res.status(400).json({ 
            message: "Mã bưu chính phải đủ 6 chữ số.",
            errorField: 'postalCode'
        });
    }

    // Số điện thoại
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(shippingAddress.phone.trim())) {
         return res.status(400).json({ 
             message: "Số điện thoại không hợp lệ ",
             errorField: 'phone'
        });
    }
    next();
};