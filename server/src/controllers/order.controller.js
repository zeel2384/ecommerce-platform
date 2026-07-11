const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const Vendor = require("../models/Vendor.model");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");

// Email transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

// Send order confirmation email
const sendOrderEmail = async (email, order) => {
  try {
    const itemsList = order.items
      .map(
        (item) =>
          `${item.name} x${item.quantity} — ₹${(
            item.price * item.quantity
          ).toLocaleString()}`,
      )
      .join("\n");

    const info = await transporter.sendMail({
      from: `"VendorMart" <${process.env.EMAIL_ADDRESS}>`,
      to: email,
      subject: `Order Confirmed! 🎉 Order #${order._id}`,
      text: `
Hi ${order.deliveryAddress.fullName}!

Your order has been placed successfully! 🎉

Order ID: ${order._id}
Order Date: ${new Date(order.createdAt).toLocaleDateString()}

Items Ordered:
${itemsList}

Total Amount: ₹${order.totalAmount.toLocaleString()}

Delivery Address:
${order.deliveryAddress.street}
${order.deliveryAddress.city}, ${order.deliveryAddress.state}
${order.deliveryAddress.pincode}

Thank you for shopping with VendorMart! 🛒
      `,
    });

    console.log("Email sent successfully! Message ID:", info.messageId);
  } catch (error) {
    console.log("Email error details:", error.message);
    console.log("Email error code:", error.code);
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

  // Create order
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

  // Send confirmation email in the background so checkout is not blocked by SMTP timeouts
  sendOrderEmail(req.user.email, order).catch((error) => {
    console.log("Email error:", error.message);
  });

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

  // Check if order belongs to customer
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

  // Find orders that contain this vendor's products
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

  const vendor = await Vendor.findOne({ user: req.user.id });

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  const ownsOrderItem = order.items.some(
    (item) => item.vendor.toString() === vendor._id.toString(),
  );

  if (!ownsOrderItem) {
    res.status(403);
    throw new Error("Not authorized to update this order");
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
