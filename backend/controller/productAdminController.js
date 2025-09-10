const Product = require('../models/Product');

const productAdminController = {
    getAllProducts: async (req, res) => {
        try{
            const products= await Product.find({});
            res.json(products);
        }catch(error){
            console.error(error)
            res.status(500).json({message: "server error"})
        }
    },
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // Ensure images are included in the update
            if (!updateData.images || !Array.isArray(updateData.images)) {
                return res.status(400).json({ message: "Images must be an array" });
            }

            const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            res.json(product);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "server error" });
        }
    },
}

module.exports = productAdminController;
