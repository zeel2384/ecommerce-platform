const express = require("express");
const router = express.Router();
const {
  setupVendorShop,
  getVendorProfile,
  updateVendorProfile,
  getAllVendors,
  approveVendor,
} = require("../controllers/vendor.controller");
const { protect, authorize } = require("../middleware/auth.middleware");
const { upload } = require("../config/cloudinary");

// Vendor routes
router.post(
  "/setup",
  protect,
  authorize("vendor"),
  upload.single("shopLogo"),
  setupVendorShop,
);

router.get("/profile", protect, authorize("vendor"), getVendorProfile);

router.put(
  "/profile",
  protect,
  authorize("vendor"),
  upload.single("shopLogo"),
  updateVendorProfile,
);

// Admin routes
router.get("/all", protect, authorize("admin"), getAllVendors);

router.put("/:id/approve", protect, authorize("admin"), approveVendor);

module.exports = router;
