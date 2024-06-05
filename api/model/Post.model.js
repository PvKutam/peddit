const mongoose = require("mongoose")

const PostSchema= new mongoose.Schema({
    description:{
        type: String,
        required: true
    },
    imageurl:String,
    user:   {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
    ,likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    Comment:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },{
            text:String,
            createdAt:{
                type: Date, 
                default: Date.now
            }
        }
    ],
    createdAt:{
        type: Date, 
        default: Date.now
    }
})

const Post = mongoose.model("Post",PostSchema)
module.exports = Post