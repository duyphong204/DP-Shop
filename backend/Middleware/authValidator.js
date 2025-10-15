export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ Email & Mật khẩu." });
    }
     if (password.length < 6) { 
        return res.status(400).json({ message: "Mật khẩu phải từ 6 ký tự trở lên" });
    }
    next();
};

export const validateRegistration = (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }
    if (password.length < 6) { // Fix lỗi chính tả: password.length
        return res.status(400).json({ message: "Mật khẩu phải từ 6 ký tự trở lên" });
    }
    next();
};
