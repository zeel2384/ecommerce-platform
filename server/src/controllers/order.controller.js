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
// Encode email to base64 with proper HTML rendering
const encodeEmail = (to, subject, htmlContent) => {
  // Create email with proper HTML content type
  const emailLines = [
    `From: "VendorMart" <${process.env.EMAIL_ADDRESS}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: 7bit",
    "",
    htmlContent,
  ];

  // Encode to base64url format required by Gmail API
  return Buffer.from(emailLines.join("\r\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

// Send order confirmation email
const sendOrderEmail = async (email, order) => {
  try {
    const gmail = await getGmailService();

    // Build the HTML content
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: #6366f1; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-family: Arial, sans-serif;">
                VendorMart
              </h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">
                Your order is confirmed!
              </p>
            </td>
          </tr>

          <!-- Success Banner -->
          <tr>
            <td style="padding: 24px 30px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 10px; padding: 16px; text-align: center;">
                    <p style="color: #166534; font-size: 20px; font-weight: bold; margin: 0; font-family: Arial, sans-serif;">
                      Thank you, ${order.deliveryAddress.fullName}!
                    </p>
                    <p style="color: #166534; margin: 8px 0 0; font-size: 15px; font-family: Arial, sans-serif;">
                      Your order has been placed successfully.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order Info -->
          <tr>
            <td style="padding: 24px 30px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #f9fafb; border-radius: 10px; padding: 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="padding: 0 8px 0 0;">
                          <p style="margin: 0; color: #666666; font-size: 13px; font-family: Arial, sans-serif;">Order ID</p>
                          <p style="margin: 4px 0 0; font-weight: bold; color: #333333; font-size: 16px; font-family: Arial, sans-serif;">
                            #${order._id.toString().slice(-8).toUpperCase()}
                          </p>
                        </td>
                        <td width="50%" style="padding: 0 0 0 8px;">
                          <p style="margin: 0; color: #666666; font-size: 13px; font-family: Arial, sans-serif;">Order Date</p>
                          <p style="margin: 4px 0 0; color: #333333; font-size: 15px; font-family: Arial, sans-serif;">
                            ${new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 24px 30px 0;">
              <p style="color: #333333; font-weight: bold; font-size: 16px; margin: 0 0 12px; font-family: Arial, sans-serif;">
                Items Ordered
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="background-color: #6366f1; color: #ffffff; padding: 10px 12px; text-align: left; font-family: Arial, sans-serif; font-size: 14px;">
                      Product
                    </th>
                    <th style="background-color: #6366f1; color: #ffffff; padding: 10px 12px; text-align: center; font-family: Arial, sans-serif; font-size: 14px;">
                      Qty
                    </th>
                    <th style="background-color: #6366f1; color: #ffffff; padding: 10px 12px; text-align: right; font-family: Arial, sans-serif; font-size: 14px;">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items
                    .map(
                      (item, index) => `
                    <tr style="background-color: ${index % 2 === 0 ? "#ffffff" : "#f9fafb"};">
                      <td style="padding: 10px 12px; color: #333333; font-family: Arial, sans-serif; font-size: 14px; border-bottom: 1px solid #e5e7eb;">
                        ${item.name}
                      </td>
                      <td style="padding: 10px 12px; color: #333333; text-align: center; font-family: Arial, sans-serif; font-size: 14px; border-bottom: 1px solid #e5e7eb;">
                        ${item.quantity}
                      </td>
                      <td style="padding: 10px 12px; color: #333333; text-align: right; font-family: Arial, sans-serif; font-size: 14px; border-bottom: 1px solid #e5e7eb;">
                        ₹${(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
                <tfoot>
                  <tr style="background-color: #f3f4f6;">
                    <td colspan="2" style="padding: 12px; font-weight: bold; color: #333333; font-family: Arial, sans-serif; font-size: 15px;">
                      Total Amount
                    </td>
                    <td style="padding: 12px; text-align: right; font-weight: bold; color: #6366f1; font-size: 18px; font-family: Arial, sans-serif;">
                      ₹${order.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </td>
          </tr>

          <!-- Delivery Address -->
          <tr>
            <td style="padding: 24px 30px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #f9fafb; border-radius: 10px; padding: 16px;">
                    <p style="color: #333333; font-weight: bold; font-size: 15px; margin: 0 0 10px; font-family: Arial, sans-serif;">
                      Delivery Address
                    </p>
                    <p style="color: #555555; line-height: 1.8; margin: 0; font-family: Arial, sans-serif; font-size: 14px;">
                      ${order.deliveryAddress.fullName}<br/>
                      ${order.deliveryAddress.street}<br/>
                      ${order.deliveryAddress.city}, ${order.deliveryAddress.state}<br/>
                      ${order.deliveryAddress.pincode}<br/>
                      Phone: ${order.deliveryAddress.phone}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order Status -->
          <tr>
            <td style="padding: 24px 30px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #ede9fe; border-radius: 10px; padding: 16px; text-align: center;">
                    <p style="color: #6366f1; font-weight: bold; font-size: 16px; margin: 0; font-family: Arial, sans-serif;">
                      Order Status: Processing
                    </p>
                    <p style="color: #666666; font-size: 13px; margin: 8px 0 0; font-family: Arial, sans-serif;">
                      Your vendor will confirm and ship your order soon.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #666666; font-size: 14px; margin: 0; font-family: Arial, sans-serif;">
                Thank you for shopping with VendorMart!
              </p>
              <p style="color: #999999; font-size: 12px; margin: 8px 0 0; font-family: Arial, sans-serif;">
                If you have any questions, please contact our support.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const subject = `Order Confirmed! Order #${order._id.toString().slice(-8).toUpperCase()}`;

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
