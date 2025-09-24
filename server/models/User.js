const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    otp:{
        type:String
    },
    otpExpires:{
        type:Date
    },
    refreshToken:{
        type:String
    }
},{timestamps:true});

module.exports = mongoose.model("User",userSchema)
