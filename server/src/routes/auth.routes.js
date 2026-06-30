const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

// Public routes (no token needed)
router.post("/register", register);
router.post("/login", login);

// Private routes (token required)
router.get("/me", protect, getMe);

module.exports = router;
