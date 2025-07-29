const Product = require('../models/Product');

const productAdminController = {
    getAllProducts: async (req, res) => {
        try{
            const products= await Product.find({});
            res.json(products);
        }catch(err){
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    }
}

module.exports = productAdminController;
