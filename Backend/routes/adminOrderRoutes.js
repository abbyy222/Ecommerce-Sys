const express = require("express");
const { requireAuth, requiredRoles } = require("../middleware/auth");
const {
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
  deleteOrder
} = require("../controllers/adminOrderController");

const router = express.Router();

// All routes require authentication and admin role
router.use(requireAuth);
router.use(requiredRoles("admin"));

// Get all orders
router.get("/", getAllOrders);

// Get order statistics
router.get("/stats", getOrderStats);

// Update order status
router.put("/:id/status", updateOrderStatus);

// Delete order (cancelled orders only)
router.delete("/:id", deleteOrder);

module.exports = router;