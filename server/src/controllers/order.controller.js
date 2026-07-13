const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const Vendor = require("../models/Vendor.model");
const asyncHandler = require("express-async-handler");
const { google } = require("googleapis");

// Gmail API Setup
const getGmailService = async () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground",
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  return google.gmail({ version: "v1", auth: oauth2Client });
};

// Encode email to base64
const encodeEmail = (to, subject, htmlContent) => {
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;

  const emailLines = [
    `From: "VendorMart" <${process.env.EMAIL_ADDRESS}>`,
    `To: ${to}`,
    `Content-Type: text/html; charset=utf-8`,
    `MIME-Version: 1.0`,
    `Content-Transfer-Encoding: quoted-printable`,
    `Subject: ${encodedSubject}`,
    ``,
    htmlContent,
  ];

  return Buffer.from(emailLines.join("\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

// Send order confirmation email
const sendOrderEmail = async (email, order) => {
  try {
    const gmail = await getGmailService();

    const itemsList = order.items
      .map(
        (item) =>
          `<tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${(
              item.price * item.quantity
            ).toLocaleString()}</td>
          </tr>`,
      )
      .join("");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">VendorMart</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Your order is confirmed!</p>
        </div>

        <!-- Success Message -->
        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 10px; padding: 16px; margin-bottom: 24px; text-align: center;">
          <p style="color: #166534; font-size: 18px; font-weight: bold; margin: 0;">
            Thank you, ${order.deliveryAddress.fullName}!
          </p>
          <p style="color: #166534; margin: 8px 0 0;">
            Your order has been placed successfully.
          </p>
        </div>

        <!-- Order Info -->
        <div style="background: #f9fafb; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0; color: #666; font-size: 14px;">Order ID</p>
          <p style="margin: 4px 0 0; font-weight: bold; color: #333; font-size: 16px;">
            #${order._id.toString().slice(-8).toUpperCase()}
          </p>
          <p style="margin: 12px 0 0; color: #666; font-size: 14px;">Order Date</p>
          <p style="margin: 4px 0 0; color: #333;">
            ${new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <!-- Items Table -->
        <h3 style="color: #333; margin-bottom: 12px;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <thead>
            <tr style="background: #6366f1; color: white;">
              <th style="padding: 10px 8px; text-align: left;">Product</th>
              <th style="padding: 10px 8px; text-align: center;">Qty</th>
              <th style="padding: 10px 8px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr style="background: #f3f4f6;">
              <td colspan="2" style="padding: 12px 8px; font-weight: bold; color: #333;">
                Total Amount
              </td>
              <td style="padding: 12px 8px; text-align: right; font-weight: bold; color: #6366f1; font-size: 18px;">
                ₹${order.totalAmount.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>

        <!-- Delivery Address -->
        <div style="background: #f9fafb; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
          <h3 style="color: #333; margin: 0 0 12px;">Delivery Address</h3>
          <p style="margin: 0; color: #555; line-height: 1.6;">
            ${order.deliveryAddress.fullName}<br/>
            ${order.deliveryAddress.street}<br/>
            ${order.deliveryAddress.city}, ${order.deliveryAddress.state}<br/>
            ${order.deliveryAddress.pincode}<br/>
            Phone: ${order.deliveryAddress.phone}
          </p>
        </div>

        <!-- Status -->
        <div style="background: #ede9fe; border-radius: 10px; padding: 16px; margin-bottom: 24px; text-align: center;">
          <p style="color: #6366f1; font-weight: bold; margin: 0; font-size: 16px;">
            Order Status: Processing
          </p>
          <p style="color: #666; margin: 8px 0 0; font-size: 14px;">
            Your vendor will confirm and ship your order soon.
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            Thank you for shopping with VendorMart!
          </p>
          <p style="color: #999; font-size: 12px; margin: 8px 0 0;">
            If you have any questions, please contact our support.
          </p>
        </div>
      </div>
    `;

    const subject = `Order Confirmed! Order #${order._id
      .toString()
      .slice(-8)
      .toUpperCase()}`;

    const encodedEmail = encodeEmail(email, subject, htmlContent);

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedEmail,
      },
    });

    console.log("Email sent successfully via Gmail API! ✅");
  } catch (error) {
    console.log("Email error:", error.message);
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
    message: "Order placed successfully!",
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
