const mongoose = require('mongoose')

const ideaSchema = new mongoose.Schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    images:[String],
    videos:[String],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    likes:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
    comments:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        text:{
            type:String
        },
        created_at:{
            type:Date,
            default:Date.now()
        }
    }]
},{timestamps:true})
module.exports = mongoose.model("Idea",ideaSchema)