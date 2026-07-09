const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User.model");

// Protect routes - checks if user is logged in
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database and attach to request
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user || !req.user.isActive) {
        res.status(401);
        throw new Error("Not authorized, user inactive or not found");
      }

      next();
    } catch (error) {
      if (error.message === "Not authorized, user inactive or not found") {
        throw error;
      }
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }
});

// Authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Role '${req.user.role}' is not authorized to access this route`,
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
