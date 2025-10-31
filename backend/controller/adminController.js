const User = require("../models/User");
const bcrypt = require("bcryptjs");

const findUserById = async (id) => {
  return await User.findById(id);
};

const escapeRegex = (text) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const adminController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({}, "-password").sort({createdAt:-1});
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
searchUser: async (req, res) => {
  try {
    const { term } = req.query;
    if (!term?.trim()) return res.json({ users: [] });

    const trimmed = term.trim();
    const esc = escapeRegex(trimmed);
    const regex = new RegExp(esc, "i");

    // Lấy tối đa 200 user để filter
    let users = await User.find({}, "-password").sort({ createdAt: -1 }).limit(200);

    // Filter trên JS
    users = users.filter(
      (u) => regex.test(u.name) || regex.test(u.email)
    );

    res.json({ users: users.slice(0, 20) });
  } catch (error) {
    console.error("searchUser error:", error);
    res.status(500).json({ message: "Server error" });
  }
},
  createUser: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const newUser = new User({
        name,
        email,
        password,
        role: role || "customer",
      });
      await newUser.save();

      res.status(201).json({ message: "User created successfully", newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  updateUser: async (req, res) => {
    try {
      const user = await findUserById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const { name, email, role, password } = req.body;

      if (name) user.name = name;
      if (email) user.email = email;
      if (role) user.role = role;
      if (password) user.password = await bcrypt.hash(password, 10);

      const updatedUser = await user.save();
      res
        .status(200)
        .json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await findUserById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      await user.deleteOne();
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = adminController;
