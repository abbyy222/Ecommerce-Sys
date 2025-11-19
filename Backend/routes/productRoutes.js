const express = require("express");
const { uploadProductImages } = require("../middlewares/uploadMiddleware.js");
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductStats,
    updateStock,
    getLowStockProducts
} = require("../controller/productController.js");


const { requireAuth, requiredRoles } = require("../middlewares/auth");

const router = express.Router();

// ========== PUBLIC ROUTES ==========
// Get all products (with search, filter, pagination)
router.get("/", getProducts);



// Create new product
router.post("/", requireAuth, requiredRoles("Admin"), uploadProductImages,
createProduct);

// Update product
router.put("/:id", requireAuth, requiredRoles("Admin"), uploadProductImages,updateProduct);

// Delete product
router.delete("/:id", requireAuth, requiredRoles("Admin"), deleteProduct);

// Update only stock
router.patch("/:id/stock", requireAuth, requiredRoles("admin"), updateStock);

// Get product statistics (for dashboard)
router.get("/stats/overview", requireAuth, requiredRoles("Admin"), getProductStats);

// Get low stock products (for alerts)
router.get("/alerts/low-stock", requireAuth, requiredRoles("Admin"), getLowStockProducts);

// Get single product by ID
router.get("/:id", getProductById);

module.exports = router;