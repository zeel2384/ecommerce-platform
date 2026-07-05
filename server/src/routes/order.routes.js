const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  getVendorOrders,
  updateOrderStatus,
} = require("../controllers/order.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

// Customer routes
router.post("/", protect, authorize("customer"), createOrder);
router.get("/my-orders", protect, authorize("customer"), getMyOrders);

// Vendor routes
router.get("/vendor-orders", protect, authorize("vendor"), getVendorOrders);
router.put("/:id/status", protect, authorize("vendor"), updateOrderStatus);

// Single order (must be last!)
router.get("/:id", protect, getOrder);

module.exports = router;
