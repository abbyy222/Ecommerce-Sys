const Order = require("../models/ordermodel");
const Product = require("../models/product");
const Cart = require("../models/cartmodel");
const DispatchRider = require("../models/dispatchRider");
const InventoryMovement = require("../models/inventoryMovement");

//Create a new order 
const createOrder = async(req, res)=> {
try{
    const cart = await Cart.findOne({user: req.user._id}).populate("items.product");
    if(!cart|| cart.items.length===0){
        return res.status(500).json({message: "Cart is empty"});

    }
    let totalAmount=0;
    const orderItems = []
    for(const item of cart.items){
        const product =await Product.findById(item.product._id);

        if(!product|| product.stock< item.quantity){
            return res.status(400).json({message: `${product.name|| 'Product'} is out of stock`});
        }
        product.stock -= item.quantity;
        await product.save();

        await InventoryMovement.create({
            product: product._id,
            user: req.user._id,
            quantity: item.quantity,
            type: "OUT",
            reason: "Customer Purchase",

        });

        const price = item.product.sellingPrice;
        orderItems.push({
            product: product._id,
            quantity: item.quantity,
            price,
        });
        totalAmount += price * item.quantity;

    }
    const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        totalAmount,

    });
    cart.items = [];
    cart.totalPrice=0;
    await cart.save();
    res.status(201).json({message: "Order created successfully", order});



}catch(err){
     console.error("Create Order Error:", err);
    res.status(500).json({message: "Error creating order", err: err.message});
}
};
//Get users orderss
const getUserOrders = async(req, res)=>{
    try{
        const orders = await Order.find({user: req.user._id})
        .populate("items.product")
        .populate("assignedRider", "name phone vehicleType")
        .sort({createdAt: -1});
        res.status(200).json({orders});
    

    }catch(err){
        console.error("Get User Orders Error:", err);
        res.status(500).json({message: "Error fetching user orders", err: err.message});

    }

}
//Get a single order
const getOrderById = async(req, res)=> {
try{
    const order = await Order.findOne({id: req.params.id, user: req.user.id})
    .populate("items.product")
    .populate("assignedRider", "name phone vehicleType currentLocation");
    if(!order){
        return res.status(404).json({message: "order not found"});

    }
    res.status(200).json(order);
}catch (err) {
    console.error("Get Order By ID Error:", err);
    res.status(500).json({ message: "Error fetching order" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Updated: Check multiple statuses
    if (["Shipped", "Delivered", "Cancelled"].includes(order.status)) {
      return res.status(400).json({ 
        message: "This order cannot be cancelled" 
      });
    }

    // Restore stock for each item
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();

        await InventoryMovement.create({
          product: product._id,
          user: req.user._id,
          quantity: item.quantity,
          type: "IN",
          reason: "Order Cancelled",
        });
      }
    }

    order.status = "Cancelled";
    order.riderStatus = "Not Assigned"; // NEW
    await order.save();

    res.status(200).json({ 
      message: "Order cancelled successfully", 
      order 
    });
  } catch (err) {
    console.error("Cancel Order Error:", err);
    res.status(500).json({ message: "Error cancelling order" });
  }
};
//get all orders - Admin only
const getAllOrders = async(req, res)=> {
  try{
    const{status, riderStatus, startDate, endDate} = req.query;
    let filter = {};
    if(status) filter.status = status;
    if(riderStatus) filter.riderStatus = riderStatus;
    if(startDate && endDate){
      filter.createdAt={
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }
 const orders = await Order.find(filter)
      .populate("user", "name email phone")
      .populate("items.product", "name")
      .populate("assignedRider", "name phone vehicleType")
      .sort({ createdAt: -1 });

    res.json({
      count: orders.length,
      orders
    });
  } catch (err) {
    console.error("Get All Orders Error:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// 6. Assign Rider to Order (Admin Only)
const assignRiderToOrder = async (req, res) => {
  try {
    const { riderId } = req.body;
    const { orderId } = req.params;

    // Check if rider exists and is available
    const rider = await DispatchRider.findById(riderId);
    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    if (!rider.isActive) {
      return res.status(400).json({ message: "Rider is not active" });
    }

    // Update order
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        assignedRider: riderId,
        riderStatus: "Assigned",
        assignedAt: new Date()
      },
      { new: true }
    ).populate("assignedRider user");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update rider status
    rider.status = "On Delivery";
    rider.totalDeliveries += 1;
    await rider.save();

    res.json({
      message: "Rider assigned successfully",
      order
    });
  } catch (err) {
    console.error("Assign Rider Error:", err);
    res.status(500).json({ message: "Error assigning rider" });
  }
};
//Get Pending Orders(Admin ONly )
const getPendingOrders =async(req, res) => {
  try{
    const count = await Order.countDocuments({status: "Pending"});
     res.json({ count }); 

  }catch(err){
    console.error("Pending Orders Count Error:", err);
    res.status(500).json({ message: "Error fetching pending orders count" });
  }

};
//Get Pending OrdersList(for Admin Only)

const getPendingOrdersList = async (req, res) => {
  try {
    const orders = await Order.find({ status: "Pending" }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: "Error fetching pending orders list" });
  }
};


// 7. Set Delivery Date (Admin Only)
const setDeliveryDate = async (req, res) => {
  try {
    const { deliveryDate } = req.body;
    const { orderId } = req.params;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { deliveryDate: new Date(deliveryDate) },
      { new: true }
    ).populate("user assignedRider");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Delivery date set successfully",
      order
    });
  } catch (err) {
    console.error("Set Delivery Date Error:", err);
    res.status(500).json({ message: "Error setting delivery date" });
  }
};

// 8. Rider Marks Ready to Dispatch (Rider Only)
const markReadyToDispatch = async (req, res) => {
  try {
    const { orderId } = req.params;
    const riderId = req.rider._id; // From auth middleware

    const order = await Order.findOne({
      _id: orderId,
      assignedRider: riderId
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.riderStatus !== "Assigned") {
      return res.status(400).json({ 
        message: "Order must be in 'Assigned' status" 
      });
    }

    order.riderStatus = "Ready to Dispatch";
    await order.save();

    res.json({
      message: "Order marked as ready to dispatch",
      order
    });
  } catch (err) {
    console.error("Mark Ready Error:", err);
    res.status(500).json({ message: "Error updating order status" });
  }
};

// 9. Start Delivery (Rider clicks "Start Delivery")
const startDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { latitude, longitude } = req.body;
    const riderId = req.rider._id;

    const order = await Order.findOne({
      _id: orderId,
      assignedRider: riderId
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.riderStatus = "Out for Delivery";
    order.dispatchedAt = new Date();
    order.status = "Shipped"; // Update main status too
    
    // Add first tracking point
    order.trackingUpdates.push({
      latitude,
      longitude,
      timestamp: new Date()
    });

    await order.save();

    res.json({
      message: "Delivery started. GPS tracking active.",
      order
    });
  } catch (err) {
    console.error("Start Delivery Error:", err);
    res.status(500).json({ message: "Error starting delivery" });
  }
};

// 10. Update Delivery Location (Called every 3-5 seconds by rider app)
const updateDeliveryLocation = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { latitude, longitude, speed, accuracy } = req.body;
    const riderId = req.rider._id;

    const order = await Order.findOne({
      _id: orderId,
      assignedRider: riderId,
      riderStatus: "Out for Delivery"
    });

    if (!order) {
      return res.status(404).json({ message: "Active delivery not found" });
    }

    // Add tracking update
    order.trackingUpdates.push({
      latitude,
      longitude,
      speed: speed || 0,
      accuracy: accuracy || 0,
      timestamp: new Date()
    });

    await order.save();

    res.json({
      message: "Location updated",
      trackingCount: order.trackingUpdates.length
    });
  } catch (err) {
    console.error("Update Location Error:", err);
    res.status(500).json({ message: "Error updating location" });
  }
};

// 11. Complete Delivery (Rider uploads proof)
const completeDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { imageUrl, notes, signature } = req.body;
    const riderId = req.rider._id;

    const order = await Order.findOne({
      _id: orderId,
      assignedRider: riderId
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.riderStatus = "Delivered";
    order.status = "Delivered";
    order.deliveredAt = new Date();
    order.proofOfDelivery = {
      imageUrl,
      uploadedAt: new Date(),
      signature,
      notes
    };

    await order.save();

    // Update rider stats
    const rider = await DispatchRider.findById(riderId);
    rider.completedDeliveries += 1;
    rider.status = "Available";
    await rider.save();

    res.json({
      message: "Delivery completed successfully",
      order
    });
  } catch (err) {
    console.error("Complete Delivery Error:", err);
    res.status(500).json({ message: "Error completing delivery" });
  }
};

// 12. Get Live Tracking (Customer views this)
const getLiveTracking = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id
    })
    .populate("assignedRider", "name phone vehicleType currentLocation")
    .select("riderStatus trackingUpdates deliveryAddress");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only return last 50 tracking points (reduce data size)
    const recentTracking = order.trackingUpdates.slice(-50);

    res.json({
      riderStatus: order.riderStatus,
      rider: order.assignedRider,
      currentLocation: order.assignedRider?.currentLocation,
      trackingHistory: recentTracking,
      deliveryAddress: order.deliveryAddress
    });
  } catch (err) {
    console.error("Get Live Tracking Error:", err);
    res.status(500).json({ message: "Error fetching tracking" });
  }
};

module.exports = {
  // Existing
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  
  // New Delivery Functions
  getAllOrders,
  assignRiderToOrder,
  setDeliveryDate,
  markReadyToDispatch,
  startDelivery,
  updateDeliveryLocation,
  completeDelivery,
  getLiveTracking,
  getPendingOrders,
   getPendingOrdersList 
};