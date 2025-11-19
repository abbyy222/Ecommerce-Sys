const mongoose = require("mongoose");
const bcrypt =require("bcryptjs");

const dispatchRiderSchema = new mongoose.Schema({
name:{
    type: String,
    required: true,
    trim: true,
},
email:{
    type: String,
    required: true,
    unique: true,
    lowercase: true,

},
password: {
    type: String,
    
},
phone:{
    type: String,
    required: true,

},
vehicleType:{
    type: String,
    enum:["Bike", "Car", "Van", "Truck"],
    required: true,

},
isActive:{
    type: Boolean,
    default: true,
},
status:{
    type: String,
    enum:["Available", "On Delivery", "Offline"],
    default:"Available",

},
currentLocation: {
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    lastUpdated: { type: Date, default: null }
  },
  totalDeliveries: {
    type: Number,
    default: 0
  },
  completedDeliveries: {
    type: Number,
    default: 0
  },
  cancelledDeliveries: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
//hash password before saving
dispatchRiderSchema.pre("save", async function(next){
    if(!this.isModified("password"))
        return next();
        this.password = await bcrypt.hash(this.password, 10);
        next();   
});
//method to compare password
dispatchRiderSchema.methods.matchPassword =async function(enteredPassword){
    return await bcrypt.compare(enteredPasword, this.password);

};
const DispatchRider = mongoose.model("DispatchRider", dispatchRiderSchema);
module.exports = DispatchRider;