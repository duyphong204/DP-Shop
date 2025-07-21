const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Product = require("./models/Product")
const User = require("./models/User")
const products=require("./data/products")


dotenv.config()
mongoose.connect(process.env.MONGO_URL)

const seedData=async()=>{
    try{    
        await Product.deleteMany()
        await User.deleteMany()
        const createdUser = await User.create({
            name:"Admin User",
            email:"admin@gmail.com",
            password:"123456",
            role:"admin"
        })
        const userId=createdUser._id
        const sampleProducts=products.map((product)=>{
            return {...product,user: userId}
        })

        await Product.insertMany(sampleProducts)
        console.log("product data seeded successfully ")
        process.exit()
    }catch(error){
        console.error("error seeding the data :",error)
        process.exit(1)
    }
}

seedData()