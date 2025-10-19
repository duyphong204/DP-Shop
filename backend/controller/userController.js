const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

const UserController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(401)
          .json({ message: "Email hoặc mật khẩu không đúng." });
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Email hoặc mật khẩu không đúng." });
      }
      return res.json({
        message: "Đăng nhập thành công",
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken: generateAccessToken(user._id),
        refreshToken: generateRefreshToken(user._id),
      });
    } catch (error) {
      console.log(error);
      res.status(500).json("server error");
    }
  },
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "Email đã được đăng ký" });
      }
      const newUser = await User.create({ name, email, password });
      const accessToken = generateAccessToken(newUser._id);
      const refreshToken = generateRefreshToken(newUser._id);
      return res.status(201).json({
        message: "Đăng ký thành công",
        newUser: {
          _id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  },
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "Không tim thấy người dùng" });
      }
      return res.json({ user });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  refreshToken: async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token" });
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const accessToken = generateAccessToken(decoded.id);
      res.json({ accessToken });
    } catch (err) {
      res.status(401).json({ message: "Invalid refresh token" });
    }
  },
};
module.exports = UserController;
