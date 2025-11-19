const jwt = require("jsonwebtoken");
const DispatchRider = require("../models/dispatchRider");

// Protect Rider Routes
const protectRider = async (req, res, next) => {
  try {
    let token;

    // Check for token in cookies
    if (req.cookies.riderToken) {
      token = req.cookies.riderToken;
    }

    // Check for token in Authorization header (for mobile apps)
    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get rider from token
    req.rider = await DispatchRider.findById(decoded.id).select("-password");

    if (!req.rider) {
      return res.status(401).json({ message: "Rider not found" });
    }

    if (!req.rider.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    next();
  } catch (error) {
    console.error("Rider Auth Error:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { protectRider };