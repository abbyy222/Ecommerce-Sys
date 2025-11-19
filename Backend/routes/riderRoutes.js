const express = require("express");
const {
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
} = require("../controller/riderController");

// YOUR existing middleware
const { requireAuth, requiredRoles } = require("../middlewares/auth.js");

// NEW rider middleware
const { protectRider } = require("../middlewares/riderMiddleware");

const router = express.Router();

// ========== PUBLIC ROUTES ==========
router.post("/login", loginRider);

// ========== ADMIN ONLY ROUTES ==========
// Admin creates rider accounts
router.post("/register", requireAuth, requiredRoles("Admin"), registerRider);

// Admin views all riders
router.get("/", requireAuth, requiredRoles("Admin"), getAllRiders);

// Admin sees available riders
router.get("/available", requireAuth, requiredRoles("admin"), getAvailableRiders);

// Admin views rider details
router.get("/:riderId", requireAuth, requiredRoles("admin"), getRiderById);

// Admin changes rider status
router.patch("/:riderId/status", requireAuth, requiredRoles("admin"), updateRiderStatus);

// Admin activates/deactivates rider
router.patch("/:riderId/toggle-active", requireAuth, requiredRoles("admin"), toggleRiderActive);

// ========== RIDER PROTECTED ROUTES ==========
// Rider updates their location
router.patch("/location", protectRider, updateRiderLocation);

// Rider views assigned orders
router.get("/my-orders", protectRider, getRiderOrders);

// Rider views their stats
router.get("/my-stats", protectRider, getRiderStats);

module.exports = router;