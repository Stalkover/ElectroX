const mongoose = require("mongoose");

let schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    cart:{
        type:Array
    },
    status:{
        type:String,
        default:"user"
    }
}, {
    collection: 'users'
});

const user_model = mongoose.model("user_model", schema);

module.exports = user_model;