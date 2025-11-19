const express = require("express");
const { requireAuth } = require("../middlewares/auth");
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  cancelOrder,
  getPendingOrders,
  assignRiderToOrder,
  getPendingOrdersList 
} = require("../controller/orderController");

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Create order from cart
router.post("/create", createOrder);

// Get all user's orders
router.get("/user", getUserOrders);
router.get("/admin", getAllOrders);
router.get("/Pend", getPendingOrders);
router.get("/pendingOrder", getPendingOrdersList )
router.patch("/:orderId/assignRider", assignRiderToOrder);


// Get single order by ID
router.get("/:orderId", getOrderById);

// Cancel order
router.patch("/:orderId/cancel", cancelOrder);

module.exports = router;