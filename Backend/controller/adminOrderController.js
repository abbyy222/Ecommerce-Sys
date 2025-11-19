const Order = require("../models/order");
const InventoryMovement = require("../models/inventoryMovement");
const Product = require("../models/product");

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name sellingPrice") // Fixed: use sellingPrice
      .sort({ createdAt: -1 }); // Most recent first

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
    
  } catch (err) {
    console.error("Get All Orders Error:", err);
    res.status(500).json({ 
      success: false,
      message: "Error fetching all orders" 
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    // Validate status
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` 
      });
    }

    const order = await Order.findById(orderId).populate("items.product");

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }

    // Store old status for comparison
    const oldStatus = order.status;

    // Handle cancellation - restore stock
    if (status === "cancelled" && oldStatus !== "cancelled") {
      for (const item of order.items) {
        const product = await Product.findById(item.product._id);
        
        if (product) {
          product.stock += item.quantity;
          await product.save();

          // Record inventory movement
          await InventoryMovement.create({
            product: product._id,
            user: req.user._id, // Admin who cancelled
            quantity: item.quantity,
            type: "IN",
            reason: `Order Cancelled by Admin - Order #${order._id}`,
          });
        }
      }
    }

    // Update status
    order.status = status;
    await order.save();

    res.status(200).json({ 
      success: true,
      message: `Order status updated from ${oldStatus} to ${status}`,
      order 
    });
    
  } catch (err) {
    console.error("Update Order Status Error:", err);
    res.status(500).json({ 
      success: false,
      message: "Error updating order status" 
    });
  }
};

// Get order statistics (bonus feature)
const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    res.status(200).json({
      success: true,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      statusBreakdown: stats
    });
    
  } catch (err) {
    console.error("Get Order Stats Error:", err);
    res.status(500).json({ 
      success: false,
      message: "Error fetching order statistics" 
    });
  }
};

// Delete order (optional - use carefully)
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }

    // Only allow deletion of cancelled orders
    if (order.status !== "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Only cancelled orders can be deleted"
      });
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: "Order deleted successfully"
    });
    
  } catch (err) {
    console.error("Delete Order Error:", err);
    res.status(500).json({ 
      success: false,
      message: "Error deleting order" 
    });
  }
};

module.exports = {
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
  deleteOrder
};