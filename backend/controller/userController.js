const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
// const {protect} = require("../Middleware/authMiddleware")

const UserController = {
  login: async (req, res) => {
    try {
      const { name, password } = req.body;
      const user = await User.findOne({ name });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }
      return res.json({
        message: "Login successful",
        user,
        accessToken: generateAccessToken(user._id),
        refreshToken: generateRefreshToken(user._id),
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      const newUser = await User.create({ name, email, password });
      res.status(201).json({
        message: "User created successfully",
        user: newUser,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
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
