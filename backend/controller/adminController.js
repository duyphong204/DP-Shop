const User = require('../models/User');

const adminController = {
    getAllUsers: async (req, res) => {
        try{
            const users = await User.find({})
            res.json(users);
        }catch(error){
            console.error(error)
            res.status(500).json({message:"server error"})
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

            res.status(201).json({ message: "Admin created successfully", newUser });
         } catch (error) {
            console.error(error)
            res.status(500).json({message:"server error"})
        }
    },
    updateUser: async (req, res) => {
        try{
            const user= await User.findById(req.params.id);
            if(user){
                user.name = req.body.name || user.name;
                user.email = req.body.email || user.email;
                user.role = req.body.role || user.role;
            }
            const updateUser = await user.save();
            res.json({message: "User updated successfully",user: updateUser})
        }catch(error){
            console.error(error)
            res.status(500).json({message: "server error"})
        }
    },
    deleteUser:async(req,res)=>{
        try{
            const user= await User.findById(req.params.id);
            if(user){
                await user.deleteOne()
                res.json({message: "User deleted successfully"})
            }else{
                res.status(404).json({ message: "User not found" });
            }
        }catch(error){
            console.error(error)
            res.status(500).json({message: "server error"})
        }
    }
}
module.exports = adminController;