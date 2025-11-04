// controllers/adminController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { paginate } = require("../utils/pagination");

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const adminController = {
  getAllUsers: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const data = await paginate(User, {}, { page, limit, sort: { createdAt: -1 } });

      data.results = data.results.map(u => {
        const { password, ...rest } = u.toObject();
        return rest;
      });

      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  searchUser: async (req, res) => {
    try {
      const { term, page = 1, limit = 10 } = req.query;
      if (!term?.trim()) {
        return res.json({ results: [], page: 1, totalPages: 1, totalItems: 0 });
      }

      const regex = new RegExp(escapeRegex(term.trim()), "i");
      const query = { $or: [{ name: regex }, { email: regex }] };

      const data = await paginate(User, query, { page, limit, sort: { createdAt: -1 } });

      data.results = data.results.map(u => {
        const { password, ...rest } = u.toObject();
        return rest;
      });

      res.json(data);
    } catch (error) {
      console.error("searchUser error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  createUser: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword, role: role || "customer" });
      await newUser.save();

      const { password: _, ...userWithoutPassword } = newUser.toObject();
      res.status(201).json({ message: "User created", newUser: userWithoutPassword });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  updateUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const { name, email, role, password } = req.body;
      if (name) user.name = name;
      if (email) user.email = email;
      if (role) user.role = role;
      if (password) user.password = await bcrypt.hash(password, 10);

      const updatedUser = await user.save();
      const { password: _, ...rest } = updatedUser.toObject();
      res.json(rest);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      await user.deleteOne();
      res.json({ message: "User deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = adminController;