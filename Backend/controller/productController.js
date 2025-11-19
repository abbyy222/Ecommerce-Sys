const Product = require("../models/product.js");
const path = require('path');
const fs = require('fs');

const createProduct = async (req, res) => {
    try {
        const { name, sku, description, costPrice, sellingPrice, stock, category } = req.body;
        
        // Check if product with SKU already exists
        const exists = await Product.findOne({ sku });
        if (exists) {
            // If there are uploaded files, delete them since product creation failed
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    fs.unlinkSync(file.path);
                });
            }
            return res.status(400).json({ message: "Product with this SKU already exists" });
        }

        // Handle uploaded images - FIXED: Don't redeclare 'images' variable
        const productImages = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                // Store relative path or full URL based on your needs
                productImages.push(`/uploads/${file.filename}`);
            });
        }

        const product = await Product.create({
            name, 
            sku, 
            description,
            costPrice,
            sellingPrice,
            images: productImages, // Use the correct variable
            category,
            stock
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (err) {
        // Delete uploaded files if there's an error
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                fs.unlinkSync(file.path);
            });
        }
        console.error("Create Product Error:", err);
        res.status(400).json({ 
            success: false,
            message: "Invalid input",
            error: err.message 
        });
    }
};

const getProducts = async (req, res) => {
    try {
        const { q, category, page = 1, limit = 10 } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (q) filter.$text = { $search: q };

        const skip = (Number(page) - 1) * Number(limit);
        const [items, total] = await Promise.all([
            Product.find(filter).sort({ createdAt: -1, _id: 1 }).skip(skip).limit(Number(limit)),
            Product.countDocuments(filter)
        ]);
        
        res.json({
            success: true,
            items,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit))
        });
    } catch (err) {
        console.error("Get Products Error:", err);
        res.status(500).json({ 
            success: false,
            message: "Error fetching products", 
            error: err.message 
        });
    }
};

// Get single product by Id - FIXED TYPO
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id); // Fixed: findbyId -> findById
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({
            success: true,
            product
        });
    } catch (err) {
        console.error("Get product by ID error", err);
        res.status(500).json({ 
            success: false,
            message: "Error fetching product", 
            error: err.message 
        });
    }
};

// Update Product - FIXED TYPO and image handling
const updateProduct = async (req, res) => {
    try {
        const { name, sku, description, costPrice, sellingPrice, stock, category } = req.body;
        
        if (sku) {
            const exist = await Product.findOne({ sku, _id: { $ne: req.params.id } });
            if (exist) {
                // Delete newly uploaded files if SKU conflict
                if (req.files && req.files.length > 0) {
                    req.files.forEach(file => {
                        fs.unlinkSync(file.path);
                    });
                }
                return res.status(400).json({ message: "Another product with this SKU already exists" });
            }
        }

        // Get existing product to handle image updates
        const existingProduct = await Product.findById(req.params.id);
        if (!existingProduct) {
            // Delete newly uploaded files if product not found
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    fs.unlinkSync(file.path);
                });
            }
            return res.status(404).json({ message: "Product not found" });
        }

        // Handle image updates
        let images = existingProduct.images;
        
        // If new files are uploaded, replace old images
        if (req.files && req.files.length > 0) {
            // Delete old image files from server
            existingProduct.images.forEach(imagePath => {
                const fullPath = path.join(__dirname, '..', imagePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });
            
            // Create new image array
            images = req.files.map(file => `/uploads/${file.filename}`);
        }

        const product = await Product.findByIdAndUpdate( // Fixed: findByIdAndUpdte -> findByIdAndUpdate
            req.params.id,
            {
                name, 
                sku, 
                description,
                costPrice,
                sellingPrice,
                images, // Use the updated images array
                category,
                stock
            },
            { new: true, runValidators: true } 
        );

        res.json({
            success: true,
            message: "Product updated successfully",
            product
        });
    } catch (err) {
        // Delete newly uploaded files if there's an error
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                fs.unlinkSync(file.path);
            });
        }
        console.error("Update Product Error:", err);
        res.status(400).json({ 
            success: false,
            message: "Error updating product", 
            error: err.message 
        });
    }
};

// Delete Product - Enhanced to delete image files
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        // Delete associated image files
        if (product.images && product.images.length > 0) {
            product.images.forEach(imagePath => {
                const fullPath = path.join(__dirname, '..', imagePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });
        }
        
        // Delete product from database
        await Product.findByIdAndDelete(req.params.id);
        
        res.json({ 
            success: true,
            message: "Product deleted successfully",
            product 
        });
    } catch (err) {
        console.error("Delete Product Error:", err);
        res.status(500).json({ 
            success: false,
            message: "Error deleting product", 
            error: err.message 
        });
    }
};

// Get Product Statistics
const getProductStats = async (req, res) => {
    try {
        const [
            totalProducts,
            inStock,
            lowStock,
            outOfStock,
            totalValue
        ] = await Promise.all([
            Product.countDocuments(),
            Product.countDocuments({ stock: { $gt: 10 } }),
            Product.countDocuments({ stock: { $gt: 0, $lte: 10 } }),
            Product.countDocuments({ stock: 0 }),
            Product.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { 
                            $sum: { $multiply: ["$sellingPrice", "$stock"] }
                        }
                    }
                }
            ])
        ]);

        // Get category breakdown
        const categoryBreakdown = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                    totalValue: { $sum: { $multiply: ["$sellingPrice", "$stock"] } }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            totalProducts,
            inStock,
            lowStock,
            outOfStock,
            totalValue: totalValue[0]?.total || 0,
            categoryBreakdown
        });
    } catch (err) {
        console.error("Get Product Stats Error:", err);
        res.status(500).json({ 
            success: false,
            message: "Error fetching statistics", 
            error: err.message 
        });
    }
};

// Update Product Stock
const updateStock = async (req, res) => {
    try {
        const { stock } = req.body;
        
        if (stock === undefined || stock < 0) {
            return res.status(400).json({ message: "Invalid stock value" });
        }
        
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { stock },
            { new: true }
        );
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.json({
            success: true,
            message: "Stock updated successfully",
            product
        });
    } catch (err) {
        console.error("Update Stock Error:", err);
        res.status(500).json({ 
            success: false,
            message: "Error updating stock", 
            error: err.message 
        });
    }
};

// Get Low Stock Products
const getLowStockProducts = async (req, res) => {
    try {
        const threshold = Number(req.query.threshold) || 10;
        
        const products = await Product.find({
            stock: { $gt: 0, $lte: threshold }
        }).sort({ stock: 1 });
        
        res.json({
            success: true,
            count: products.length,
            products
        });
    } catch (err) {
        console.error("Get Low Stock Error:", err);
        res.status(500).json({ 
            success: false,
            message: "Error fetching low stock products", 
            error: err.message 
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductStats,
    updateStock,
    getLowStockProducts
};