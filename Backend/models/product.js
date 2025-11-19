const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{type: String, required: true, trim: true, index: true},
    sku:{type: String, required: true, unique: true, uppercase:true},//stock keepiing unit 
    description:{type: String, default: ""},
    images:[{type: String}],
    category:{type: String, index: true},
    costPrice:{type: Number, required:true, min: 0},
    sellingPrice:{type: Number, required: true, min: 0},
    stock:{type: Number, required: true, min: 0, default: 0},
    active: { type: Boolean, default: true }
}, {timestamps: true});
const Product = mongoose.model("Product", productSchema);
module.exports= Product;