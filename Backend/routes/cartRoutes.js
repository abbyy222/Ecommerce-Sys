// routes/cartRoutes.js
const express = require("express");
const {
  addToCart,
  removeFromCart,
  updateQuantity,
  getCart,
} = require("../controller/cartController");
const { requireAuth } = require("../middlewares/auth");

const router = express.Router();

router.post("/add", requireAuth, addToCart);
router.delete("/remove/:productId", requireAuth, removeFromCart);
router.put("/update", requireAuth, updateQuantity);
router.get("/", requireAuth, getCart);

module.exports = router;
