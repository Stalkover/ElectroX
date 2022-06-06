const mongoose = require("mongoose");

let schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    cost:{
        type:Number,
        required:true
    },
    cart:{
        type:Array
    },
    stock:{
        type:Number
    }
}, {
    collection: 'products'
});

const prod_model = mongoose.model("prod_model", schema);

module.exports = prod_model;