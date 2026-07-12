const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const Vendor = require("../models/Vendor.model");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// OAuth2 Setup
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground",
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_ADDRESS,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
  });

  return transporter;
};

// Send order confirmation email
const sendOrderEmail = async (email, order) => {
  try {
    const transporter = await createTransporter();

    await transporter.verify();
    console.log("Transporter verified ✅");

    await transporter.sendMail({
      from: `"VendorMart" <${process.env.EMAIL_ADDRESS}>`,
      to: email,
      subject: `Order Confirmed! 🎉 Order #${order._id
        .toString()
        .slice(-8)
        .toUpperCase()}`,
      html: `...your existing html...`,
    });

    console.log("Email sent successfully! ✅");
  } catch (error) {
    console.log("Email error:", error.message);
    console.log("Email error code:", error.code);
    console.log("Email error response:", error.response);
  }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private (customer only)
const createOrder = asyncHandler(async (req, res) => {
  const { items, deliveryAddress, totalAmount } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No items in order");
  }

  const order = await Order.create({
    customer: req.user.id,
    items,
    deliveryAddress,
    totalAmount,
    paymentStatus: "paid",
    orderStatus: "Processing",
    paymentId: `MOCK_${Date.now()}`,
  });

  // Update product stock and vendor stats
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, sold: item.quantity },
    });

    await Vendor.findByIdAndUpdate(item.vendor, {
      $inc: {
        totalOrders: 1,
        totalRevenue: item.price * item.quantity,
      },
    });
  }

  // Send confirmation email
  await sendOrderEmail(req.user.email, order);

  res.status(201).json({
    success: true,
    message: "Order placed successfully! 🎉",
    order,
  });
});

// @desc    Get customer orders
// @route   GET /api/orders/my-orders
// @access  Private (customer only)
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user.id })
    .populate("items.product", "name images")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "items.product",
    "name images",
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.customer.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// @desc    Get vendor orders
// @route   GET /api/orders/vendor-orders
// @access  Private (vendor only)
const getVendorOrders = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user.id });

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  const orders = await Order.find({
    "items.vendor": vendor._id,
  })
    .populate("customer", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (vendor only)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.orderStatus = orderStatus;
  await order.save();

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    order,
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  getVendorOrders,
  updateOrderStatus,
};
