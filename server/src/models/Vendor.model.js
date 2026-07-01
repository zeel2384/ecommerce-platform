const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    shopName: {
      type: String,
      required: [true, "Shop name is required"],
      trim: true,
      minlength: [3, "Shop name must be at least 3 characters"],
    },
    shopDescription: {
      type: String,
      required: [true, "Shop description is required"],
      minlength: [10, "Description must be at least 10 characters"],
    },
    shopLogo: {
      type: String,
      default: "",
    },
    shopAddress: {
      type: String,
      default: "",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalProducts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Vendor", vendorSchema);
