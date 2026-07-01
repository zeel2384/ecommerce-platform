const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addReview,
} = require("../controllers/product.controller");
const { protect, authorize } = require("../middleware/auth.middleware");
const { upload } = require("../config/cloudinary");

// Public routes
router.get("/", getProducts);
router.get("/:id", getProduct);

// Vendor routes
router.post(
  "/",
  protect,
  authorize("vendor"),
  upload.array("images", 5),
  createProduct,
);

router.put(
  "/:id",
  protect,
  authorize("vendor"),
  upload.array("images", 5),
  updateProduct,
);

router.delete("/:id", protect, authorize("vendor"), deleteProduct);

// Customer routes
router.post("/:id/reviews", protect, authorize("customer"), addReview);

module.exports = router;
