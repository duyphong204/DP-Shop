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
    }
}

module.exports = productAdminController;
