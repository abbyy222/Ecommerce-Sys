// server.js
const express = require("express");
const path = require('path');



const dotenv = require("dotenv");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const helment = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");


// your code continues here...
const connectDB = require("./config/connectDB.js");
const authRoutes = require("./routes/authRoutes.js");
const prodRoutes = require("./routes/productRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const riderRoutes = require("./routes/riderRoutes.js");

dotenv.config();

const app = express();

//Security and utilities
app.use(helment());
app.use(morgan("dev"));

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

//Middleware 
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
    origin: "http://localhost:5173", // frontend URL (we’ll use Vite later)
  credentials: true,
}))
app.use("/api/auth", authRoutes);
app.use("/api/products", prodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/riders", riderRoutes);

const authLimiter =rateLimit({
  windowsMs: 60*1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});
app.use("/api/auth", authLimiter);

//Simple test route 
app.get("/",(req,res)=>{
    res.send("BugForge Api is working perfectly")
})
connectDB();

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

