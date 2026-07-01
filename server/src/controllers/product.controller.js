const Product = require("../models/Product.model");
const Vendor = require("../models/Vendor.model");
const asyncHandler = require("express-async-handler");
const { uploadToCloudinary } = require("../config/cloudinary");

// @desc    Create product
// @route   POST /api/products
// @access  Private (vendor only)
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, discountPrice, category, stock } = req.body;

  // Find vendor profile
  const vendor = await Vendor.findOne({ user: req.user.id });

  if (!vendor) {
    res.status(404);
    throw new Error("Vendor shop not found");
  }

  if (!vendor.isApproved) {
    res.status(403);
    throw new Error("Your shop is not approved yet");
  }

  // Upload images to cloudinary
  let images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, "products");
      images.push(result.secure_url);
    }
  }

  // Create product
  const product = await Product.create({
    vendor: vendor._id,
    name,
    description,
    price,
    discountPrice: discountPrice || 0,
    category,
    stock,
    images,
  });

  // Update vendor product count
  vendor.totalProducts += 1;
  await vendor.save();

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  // Build query
  let query = { isActive: true };

  // Search by keyword
  if (keyword) {
    query.name = { $regex: keyword, $options: "i" };
  }

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Sort options
  let sortOption = {};
  if (sort === "price_low") sortOption = { price: 1 };
  else if (sort === "price_high") sortOption = { price: -1 };
  else if (sort === "newest") sortOption = { createdAt: -1 };
  else if (sort === "popular") sortOption = { sold: -1 };
  else sortOption = { createdAt: -1 };

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);

  const products = await Product.find(query)
    .populate("vendor", "shopName shopLogo")
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    products,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "vendor",
    "shopName shopLogo shopDescription",
  );

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (vendor only)
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, discountPrice, category, stock } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Find vendor and check ownership
  const vendor = await Vendor.findOne({ user: req.user.id });
  if (product.vendor.toString() !== vendor._id.toString()) {
    res.status(403);
    throw new Error("You can only update your own products");
  }

  // Upload new images if provided
  if (req.files && req.files.length > 0) {
    let images = [];
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, "products");
      images.push(result.secure_url);
    }
    product.images = images;
  }

  // Update fields
  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.discountPrice = discountPrice || product.discountPrice;
  product.category = category || product.category;
  product.stock = stock !== undefined ? stock : product.stock;

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (vendor only)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check ownership
  const vendor = await Vendor.findOne({ user: req.user.id });
  if (product.vendor.toString() !== vendor._id.toString()) {
    res.status(403);
    throw new Error("You can only delete your own products");
  }

  await product.deleteOne();

  // Update vendor product count
  vendor.totalProducts -= 1;
  await vendor.save();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private (customer only)
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if already reviewed
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user.id.toString(),
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this product");
  }

  // Add review
  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;

  // Calculate average rating
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();

  res.status(201).json({
    success: true,
    message: "Review added successfully",
  });
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addReview,
};
