const DispatchRider = require("../models/dispatchRider");
const Order = require("../models/ordermodel");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (riderId) => {
  return jwt.sign({ id: riderId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 1. Register New Rider (Admin Only)
const registerRider = async (req, res) => {
  try {
    const { name, email,  phone, vehicleType, vehicleNumber } = req.body;

    // Check if rider exists
    const riderExists = await DispatchRider.findOne({ email });
    if (riderExists) {
      return res.status(400).json({ message: "Rider already exists" });
    }

    // Create rider
    const rider = await DispatchRider.create({
      name,
      email,
      phone,
      vehicleType,
      vehicleNumber
    });

    res.status(201).json({
      message: "Rider registered successfully",
      rider: {
        _id: rider._id,
        name: rider.name,
        email: rider.email,
        phone: rider.phone,
        vehicleType: rider.vehicleType,
        status: rider.status
      }
    });
  } catch (err) {
    console.error("Register Rider Error:", err);
    res.status(500).json({ message: "Error registering rider", error: err.message });
  }
};

// 2. Rider Login
const loginRider = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find rider with password
    const rider = await DispatchRider.findOne({ email }).select("+password");
    
    if (!rider || !(await rider.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!rider.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    // Generate token
    const token = generateToken(rider._id);
    
    res.cookie("riderToken", token, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: "Login successful",
      rider: {
        _id: rider._id,
        name: rider.name,
        email: rider.email,
        phone: rider.phone,
        vehicleType: rider.vehicleType,
        status: rider.status,
        rating: rider.rating
      }
    });
  } catch (err) {
    console.error("Rider Login Error:", err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

// 3. Get All Riders (Admin Only)
const getAllRiders = async (req, res) => {
  try {
    const { status, isActive } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const riders = await DispatchRider.find(filter).sort({ createdAt: -1 });
    
    res.json({
      count: riders.length,
      riders
    });
  } catch (err) {
    console.error("Get All Riders Error:", err);
    res.status(500).json({ message: "Error fetching riders" });
  }
};

// 4. Get Available Riders (Admin Only)
const getAvailableRiders = async (req, res) => {
  try {
    const riders = await DispatchRider.find({
      isActive: true,
      status: "Available"
    }).select("name phone vehicleType rating totalDeliveries");

    res.json({
      count: riders.length,
      riders
    });
  } catch (err) {
    console.error("Get Available Riders Error:", err);
    res.status(500).json({ message: "Error fetching available riders" });
  }
};

// 5. Get Single Rider
const getRiderById = async (req, res) => {
  try {
    const rider = await DispatchRider.findById(req.params.riderId);
    
    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    // Get rider's orders
    const orders = await Order.find({ assignedRider: rider._id })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      rider,
      recentOrders: orders
    });
  } catch (err) {
    console.error("Get Rider By ID Error:", err);
    res.status(500).json({ message: "Error fetching rider details" });
  }
};

// 6. Update Rider Location (Rider uses this while on delivery)
const updateRiderLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const riderId = req.rider._id; // From auth middleware

    const rider = await DispatchRider.findByIdAndUpdate(
      riderId,
      {
        currentLocation: {
          latitude,
          longitude,
          lastUpdated: new Date()
        }
      },
      { new: true }
    );

    // Also update tracking in active order
    const activeOrder = await Order.findOne({
      assignedRider: riderId,
      riderStatus: "Out for Delivery"
    });

    if (activeOrder) {
      activeOrder.trackingUpdates.push({
        latitude,
        longitude,
        timestamp: new Date()
      });
      await activeOrder.save();
    }

    res.json({
      message: "Location updated",
      location: rider.currentLocation
    });
  } catch (err) {
    console.error("Update Rider Location Error:", err);
    res.status(500).json({ message: "Error updating location" });
  }
};

// 7. Update Rider Status (Admin or Rider)
const updateRiderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { riderId } = req.params;

    const rider = await DispatchRider.findByIdAndUpdate(
      riderId,
      { status },
      { new: true }
    );

    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    res.json({
      message: "Status updated",
      rider
    });
  } catch (err) {
    console.error("Update Rider Status Error:", err);
    res.status(500).json({ message: "Error updating status" });
  }
};

// 8. Toggle Rider Active Status (Admin Only)
const toggleRiderActive = async (req, res) => {
  try {
    const rider = await DispatchRider.findById(req.params.riderId);
    
    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    rider.isActive = !rider.isActive;
    await rider.save();

    res.json({
      message: `Rider ${rider.isActive ? "activated" : "deactivated"}`,
      rider
    });
  } catch (err) {
    console.error("Toggle Rider Active Error:", err);
    res.status(500).json({ message: "Error updating rider status" });
  }
};

// 9. Get Rider's Assigned Orders
const getRiderOrders = async (req, res) => {
  try {
    const riderId = req.rider._id; // From auth middleware
    const { status } = req.query;

    let filter = { assignedRider: riderId };
    if (status) filter.riderStatus = status;

    const orders = await Order.find(filter)
      .populate("user", "name phone")
      .populate("items.product", "name")
      .sort({ createdAt: -1 });

    res.json({
      count: orders.length,
      orders
    });
  } catch (err) {
    console.error("Get Rider Orders Error:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// 10. Get Rider Dashboard Stats
const getRiderStats = async (req, res) => {
  try {
    const riderId = req.rider._id;

    const stats = {
      totalOrders: await Order.countDocuments({ assignedRider: riderId }),
      pendingOrders: await Order.countDocuments({ 
        assignedRider: riderId, 
        riderStatus: "Assigned" 
      }),
      inTransit: await Order.countDocuments({ 
        assignedRider: riderId, 
        riderStatus: "Out for Delivery" 
      }),
      completed: await Order.countDocuments({ 
        assignedRider: riderId, 
        riderStatus: "Delivered" 
      })
    };

    const rider = await DispatchRider.findById(riderId);
    
    res.json({
      stats,
      riderInfo: {
        rating: rider.rating,
        totalDeliveries: rider.totalDeliveries,
        completedDeliveries: rider.completedDeliveries
      }
    });
  } catch (err) {
    console.error("Get Rider Stats Error:", err);
    res.status(500).json({ message: "Error fetching stats" });
  }
};

module.exports = {
  registerRider,
  loginRider,
  getAllRiders,
  getAvailableRiders,
  getRiderById,
  updateRiderLocation,
  updateRiderStatus,
  toggleRiderActive,
  getRiderOrders,
  getRiderStats
};