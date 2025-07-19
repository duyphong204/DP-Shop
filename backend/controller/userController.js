const User = require("../models/User");
const jwt = require("jsonwebtoken");

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
      return res.json({ message: "Login successful", user });
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
      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};
module.exports = UserController;
