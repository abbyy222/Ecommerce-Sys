const mongoose = require("mongoose");
const inventorySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,

    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    quantity: { type: Number, required: true },
  type: { type: String, enum: ["IN", "OUT"], required: true },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("InventoryMovement", inventorySchema);