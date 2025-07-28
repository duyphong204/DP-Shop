const User = require('../models/User');

const adminController = {
    getAllUsers: async (req, res) => {
        try{
            const users = await User.find({})
            res.json(users);
        }catch(err){
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    },
    createUser: async (req, res) => {
        const { name,email, password,role } = req.body;
        try {
            // Check if the user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }
            // Create a new admin user
            const newUser = new User({
                name,
                email,
                password,
                role: role || "customer" // default to admin if role is not provided
            });
            await newUser.save();

            return res.status(201).json({ message: "Admin created successfully", newUser });
         } catch (error) {
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    },
    updateUser: async (req, res) => {
        try{
            const user= await User.findById(req.params.id);
            if(!user){
                return res.status(404).json({ message: "User not found" });
            }
            const { name, email, role } = req.body;
            user.name = name || user.name;
            user.email = email || user.email;
            user.role = role || user.role;
            await user.save();
            return res.status(200).json({ message: "User updated successfully", user });
        }catch(err){
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    },
    deleteUser:async(req,res)=>{
        try{
            const user= await User.findByIdAndDelete(req.params.id);
            if(!user){
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({ message: "User deleted successfully" });
        }catch(err){
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    }
}
module.exports = adminController;