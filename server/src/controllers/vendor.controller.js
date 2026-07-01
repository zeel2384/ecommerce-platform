const Vendor = require("../models/Vendor.model");
const User = require("../models/User.model");
const asyncHandler = require("express-async-handler");
const { uploadToCloudinary } = require("../config/cloudinary");

// @desc    Setup vendor shop
// @route   POST /api/vendor/setup
// @access  Private (vendor only)
const setupVendorShop = asyncHandler(async (req, res) => {
  const { shopName, shopDescription, shopAddress } = req.body;

  // Check if vendor shop already exists
  const existingVendor = await Vendor.findOne({ user: req.user.id });
  if (existingVendor) {
    res.status(400);
    throw new Error("Shop already exists for this account");
  }

  // Check if user role is vendor
  if (req.user.role !== "vendor") {
    res.status(403);
    throw new Error("Only vendors can setup a shop");
  }

  // Upload logo if provided
  let shopLogo = "";
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "vendors");
    shopLogo = result.secure_url;
  }

  // Create vendor shop
  const vendor = await Vendor.create({
    user: req.user.id,
    shopName,
    shopDescription,
    shopAddress,
    shopLogo,
  });

  res.status(201).json({
    success: true,
    message: "Shop created successfully! Waiting for admin approval.",
    vendor,
  });
});

// @desc    Get vendor profile
// @route   GET /api/vendor/profile
// @access  Private (vendor only)
const getVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user.id }).populate(
    "user",
    "name email",
  );

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor shop not found");
  }

  res.status(200).json({
    success: true,
    vendor,
  });
});

// @desc    Update vendor profile
// @route   PUT /api/vendor/profile
// @access  Private (vendor only)
const updateVendorProfile = asyncHandler(async (req, res) => {
  const { shopName, shopDescription, shopAddress } = req.body;

  const vendor = await Vendor.findOne({ user: req.user.id });

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor shop not found");
  }

  // Upload new logo if provided
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "vendors");
    vendor.shopLogo = result.secure_url;
  }

  // Update fields
  vendor.shopName = shopName || vendor.shopName;
  vendor.shopDescription = shopDescription || vendor.shopDescription;
  vendor.shopAddress = shopAddress || vendor.shopAddress;

  await vendor.save();

  res.status(200).json({
    success: true,
    message: "Shop updated successfully",
    vendor,
  });
});

// @desc    Get all vendors (admin)
// @route   GET /api/vendor/all
// @access  Private (admin only)
const getAllVendors = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find().populate("user", "name email");

  res.status(200).json({
    success: true,
    count: vendors.length,
    vendors,
  });
});

// @desc    Approve or reject vendor
// @route   PUT /api/vendor/:id/approve
// @access  Private (admin only)
const approveVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  vendor.isApproved = req.body.isApproved;
  await vendor.save();

  res.status(200).json({
    success: true,
    message: `Vendor ${req.body.isApproved ? "approved" : "rejected"} successfully`,
    vendor,
  });
});

module.exports = {
  setupVendorShop,
  getVendorProfile,
  updateVendorProfile,
  getAllVendors,
  approveVendor,
};
