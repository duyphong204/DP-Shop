const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")

const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim : true
        },
        email :{
            type:String,
            required:true,
            unique:true,
            trim:true,
            match:[/^\S+@\S+\.\S+$/,"Please enter a valid email address"]
        },
        password:{
            type:String,
            required:true,
            minlength:[6,"Password must be at least 6 characters long"]
        },
        role : {
            type:String,
            enum:["customer","admin"],
            default:"customer"
        }
    },{timestamps:true}
)
// password hash middleware 
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next()
    this.password=await bcrypt.hash(this.password,10)
    next()
})

// compare password
userSchema.methods.matchPassword=async function(password){
    return await bcrypt.compare(password,this.password)
}
module.exports=mongoose.model("User",userSchema)