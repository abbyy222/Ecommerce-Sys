const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  
  // NEW DELIVERY FIELDS
  assignedRider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DispatchRider",
    default: null
  },
  deliveryDate: {
    type: Date,
    default: null
  },
  riderStatus: {
    type: String,
    enum: [
      "Not Assigned",      // Initial state
      "Assigned",          // Admin assigned rider
      "Ready to Dispatch", // Rider clicked ready
      "Out for Delivery",  // Rider started GPS tracking
      "Delivered",         // Order completed
      "Failed"             // Delivery failed
    ],
    default: "Not Assigned"
  },
  
  // 📍 Live GPS Tracking
  trackingUpdates: [
    {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now },
      speed: { type: Number, default: 0 }, // km/h
      accuracy: { type: Number, default: 0 } // meters
    }
  ],
  
  // 📸 Proof of Delivery
  proofOfDelivery: {
    imageUrl: { type: String, default: null },
    uploadedAt: { type: Date, default: null },
    signature: { type: String, default: null }, // Optional customer signature
    notes: { type: String, default: null } // Delivery notes
  },
  
  // 📍 Delivery Address (you might want to add this)
  deliveryAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    latitude: { type: Number },
    longitude: { type: Number }
  },
  
  // ⏰ Timestamps
  assignedAt: { type: Date, default: null },
  dispatchedAt: { type: Date, default: null },
  deliveredAt: { type: Date, default: null },
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-update updatedAt on save
orderSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;