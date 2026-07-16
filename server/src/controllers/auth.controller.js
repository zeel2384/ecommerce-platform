const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { generateOTP, getOTPExpiry } = require("../utils/otp");
const { sendOTPEmail } = require("../utils/sendEmail");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register user - Step 1 (send OTP)
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("Register attempt:", { name, email, role }); // ← add this

    const existingUser = await User.findOne({ email });
    console.log("Existing user:", existingUser ? "found" : "not found"); // ← add this

    if (existingUser && existingUser.isVerified) {
      res.status(400);
      throw new Error("User already exists with this email");
    }

    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();
    console.log("OTP generated:", otp); // ← add this

    if (existingUser && !existingUser.isVerified) {
      existingUser.name = name;
      existingUser.password = password;
      existingUser.role = role || "customer";
      existingUser.otp = {
        code: otp,
        expiresAt: otpExpiry,
        verified: false,
      };
      await existingUser.save();
      console.log("Existing user updated"); // ← add this
    } else {
      await User.create({
        name,
        email,
        password,
        role: role || "customer",
        isVerified: false,
        otp: {
          code: otp,
          expiresAt: otpExpiry,
          verified: false,
        },
      });
      console.log("New user created"); // ← add this
    }

    await sendOTPEmail(email, otp, "register");
    console.log("OTP email sent"); // ← add this

    res.status(200).json({
      success: true,
      message:
        "OTP sent to your email. Please verify to complete registration.",
      email,
    });
  } catch (error) {
    console.log("Register error:", error.message); // ← add this
    console.log("Register error stack:", error.stack); // ← add this
    throw error;
  }
});
// @desc    Verify OTP for registration
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check OTP
  if (user.otp.code !== otp) {
    res.status(400);
    throw new Error("Invalid OTP");
  }

  // Check OTP expiry
  if (user.otp.expiresAt < new Date()) {
    res.status(400);
    throw new Error("OTP has expired. Please register again.");
  }

  // Mark user as verified
  user.isVerified = true;
  user.otp = { code: null, expiresAt: null, verified: true };
  await user.save();

  res.status(201).json({
    success: true,
    message: "Account verified successfully!",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user._id),
  });
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Generate new OTP
  const otp = generateOTP();
  const otpExpiry = getOTPExpiry();

  user.otp = {
    code: otp,
    expiresAt: otpExpiry,
    verified: false,
  };
  await user.save();

  // Send new OTP
  await sendOTPEmail(email, otp, "register");

  res.status(200).json({
    success: true,
    message: "New OTP sent to your email!",
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Check if account is verified
  // Legacy users (created before OTP) are auto-verified
  if (user.isVerified === false) {
    // Auto verify legacy users
    user.isVerified = true;
    await user.save();
  }

  // Check if account is active
  if (!user.isActive) {
    res.status(401);
    throw new Error("Your account has been deactivated");
  }

  // Compare password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user._id),
  });
});

// @desc    Forgot password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("No account found with this email");
  }

  // Generate OTP
  const otp = generateOTP();
  const otpExpiry = getOTPExpiry();

  user.otp = {
    code: otp,
    expiresAt: otpExpiry,
    verified: false,
  };

  // Mark old users as verified automatically
  if (!user.isVerified) {
    user.isVerified = true;
  }

  await user.save();

  // Send OTP email
  await sendOTPEmail(email, otp, "forgot");

  res.status(200).json({
    success: true,
    message: "OTP sent to your email",
    email,
  });
});

// @desc    Verify OTP for forgot password
// @route   POST /api/auth/verify-forgot-otp
// @access  Public
const verifyForgotOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.otp.code !== otp) {
    res.status(400);
    throw new Error("Invalid OTP");
  }

  if (user.otp.expiresAt < new Date()) {
    res.status(400);
    throw new Error("OTP has expired");
  }

  // Mark OTP as verified
  user.otp.verified = true;
  await user.save();

  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
    email,
  });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!user.otp.verified) {
    res.status(400);
    throw new Error("Please verify OTP first");
  }

  // Update password
  user.password = password;
  user.otp = { code: null, expiresAt: null, verified: false };
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully! Please login.",
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  });
});

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  login,
  forgotPassword,
  verifyForgotOTP,
  resetPassword,
  getMe,
};
