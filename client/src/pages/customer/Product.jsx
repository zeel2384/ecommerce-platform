import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, addReview } from "../../api";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, isCustomer } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
  });
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await getProduct(id);
      setProduct(data.product);
    } catch (error) {
      toast.error("Product not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to add a review");
      navigate("/login");
      return;
    }
    try {
      setReviewLoading(true);
      await addReview(id, reviewData);
      toast.success("Review added successfully! ⭐");
      fetchProduct();
      setReviewData({ rating: 5, comment: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add review");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <p>Loading product... ⏳</p>
      </div>
    );
  }

  if (!product) return null;

  const discount =
    product.discountPrice > 0
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100,
        )
      : 0;

  return (
    <div style={styles.container}>
      {/* Product Main Section */}
      <div style={styles.mainSection}>
        {/* Images */}
        <div style={styles.imageSection}>
          <div style={styles.mainImageContainer}>
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                style={styles.mainImage}
              />
            ) : (
              <div style={styles.noImage}>📦 No Image</div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div style={styles.thumbnails}>
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  style={
                    selectedImage === index
                      ? styles.thumbnailActive
                      : styles.thumbnail
                  }
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={styles.infoSection}>
          {/* Vendor */}
          <p style={styles.vendorName}>🏪 {product.vendor?.shopName}</p>

          {/* Name */}
          <h1 style={styles.productName}>{product.name}</h1>

          {/* Rating */}
          <div style={styles.rating}>
            {"⭐".repeat(Math.round(product.rating || 0))}
            <span style={styles.ratingText}>
              {product.rating?.toFixed(1)} ({product.numReviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div style={styles.priceContainer}>
            {product.discountPrice > 0 ? (
              <>
                <span style={styles.discountPrice}>
                  ₹{product.discountPrice.toLocaleString()}
                </span>
                <span style={styles.originalPrice}>
                  ₹{product.price.toLocaleString()}
                </span>
                <span style={styles.discountBadge}>{discount}% OFF</span>
              </>
            ) : (
              <span style={styles.discountPrice}>
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Description */}
          <p style={styles.description}>{product.description}</p>

          {/* Category */}
          <p style={styles.category}>
            Category: <strong>{product.category}</strong>
          </p>

          {/* Stock */}
          <p style={product.stock > 0 ? styles.inStock : styles.outOfStock}>
            {product.stock > 0
              ? `✅ In Stock (${product.stock} available)`
              : "❌ Out of Stock"}
          </p>

          {/* Quantity */}
          {product.stock > 0 && (
            <div style={styles.quantityContainer}>
              <button
                style={styles.qtyBtn}
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                −
              </button>
              <span style={styles.qtyValue}>{quantity}</span>
              <button
                style={styles.qtyBtn}
                onClick={() =>
                  setQuantity((prev) => Math.min(product.stock, prev + 1))
                }
              >
                +
              </button>
            </div>
          )}

          {/* Add to Cart */}
          <button
            style={product.stock > 0 ? styles.button : styles.buttonDisabled}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? "Add to Cart 🛒" : "Out of Stock"}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={styles.reviewsSection}>
        <h2 style={styles.reviewsTitle}>
          Customer Reviews ({product.numReviews})
        </h2>

        {/* Add Review Form */}
        {isAuthenticated && isCustomer && (
          <div style={styles.reviewForm}>
            <h3 style={styles.reviewFormTitle}>Write a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div style={styles.field}>
                <label style={styles.label}>Rating</label>
                <select
                  style={styles.select}
                  value={reviewData.rating}
                  onChange={(e) =>
                    setReviewData({
                      ...reviewData,
                      rating: Number(e.target.value),
                    })
                  }
                >
                  <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                  <option value={4}>⭐⭐⭐⭐ Good</option>
                  <option value={3}>⭐⭐⭐ Average</option>
                  <option value={2}>⭐⭐ Poor</option>
                  <option value={1}>⭐ Terrible</option>
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Comment</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Share your experience..."
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                  required
                  rows={4}
                />
              </div>
              <button
                style={reviewLoading ? styles.buttonDisabled : styles.button}
                type="submit"
                disabled={reviewLoading}
              >
                {reviewLoading ? "Submitting..." : "Submit Review ⭐"}
              </button>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review, index) => (
            <div key={index} style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <strong>{review.name}</strong>
                <span>{"⭐".repeat(review.rating)}</span>
              </div>
              <p style={styles.reviewComment}>{review.comment}</p>
              <p style={styles.reviewDate}>
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p style={styles.noReviews}>
            No reviews yet. Be the first to review!
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
  },
  loading: {
    textAlign: "center",
    padding: "3rem",
    color: "#666",
  },
  mainSection: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "2rem",
    marginBottom: "3rem",
  },
  imageSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  mainImageContainer: {
    height: "400px",
    backgroundColor: "#f5f5f5",
    borderRadius: "12px",
    overflow: "hidden",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  noImage: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3rem",
    color: "#999",
  },
  thumbnails: {
    display: "flex",
    gap: "8px",
  },
  thumbnail: {
    width: "70px",
    height: "70px",
    objectFit: "cover",
    borderRadius: "8px",
    cursor: "pointer",
    border: "2px solid transparent",
  },
  thumbnailActive: {
    width: "70px",
    height: "70px",
    objectFit: "cover",
    borderRadius: "8px",
    cursor: "pointer",
    border: "2px solid #6366f1",
  },
  infoSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  vendorName: {
    color: "#6366f1",
    fontWeight: "500",
    fontSize: "14px",
  },
  productName: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#333",
  },
  rating: {
    fontSize: "16px",
  },
  ratingText: {
    color: "#666",
    fontSize: "14px",
    marginLeft: "8px",
  },
  priceContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  discountPrice: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333",
  },
  originalPrice: {
    fontSize: "1.2rem",
    color: "#999",
    textDecoration: "line-through",
  },
  discountBadge: {
    backgroundColor: "#ef4444",
    color: "white",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  description: {
    color: "#555",
    lineHeight: "1.6",
  },
  category: {
    color: "#666",
    fontSize: "14px",
  },
  inStock: {
    color: "#22c55e",
    fontWeight: "500",
  },
  outOfStock: {
    color: "#ef4444",
    fontWeight: "500",
  },
  quantityContainer: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  qtyBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "1px solid #e5e7eb",
    backgroundColor: "white",
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: "1",
    color: "#333",
    padding: "0",
  },
  qtyValue: {
    fontSize: "1.2rem",
    fontWeight: "600",
    minWidth: "30px",
    textAlign: "center",
  },
  button: {
    padding: "0.75rem 2rem",
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  buttonDisabled: {
    padding: "0.75rem 2rem",
    backgroundColor: "#e5e7eb",
    color: "#9ca3af",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "not-allowed",
  },
  reviewsSection: {
    borderTop: "1px solid #e5e7eb",
    paddingTop: "2rem",
  },
  reviewsTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    color: "#333",
  },
  reviewForm: {
    backgroundColor: "#f9fafb",
    padding: "1.5rem",
    borderRadius: "12px",
    marginBottom: "2rem",
  },
  reviewFormTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "1rem",
    color: "#333",
  },
  field: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "500",
    color: "#333",
  },
  select: {
    width: "100%",
    padding: "0.6rem",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "1rem",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "1rem",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
  },
  reviewCard: {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    marginBottom: "1rem",
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
  },
  reviewComment: {
    color: "#555",
    lineHeight: "1.5",
    marginBottom: "0.5rem",
  },
  reviewDate: {
    color: "#999",
    fontSize: "12px",
  },
  noReviews: {
    color: "#666",
    textAlign: "center",
    padding: "2rem",
  },
};

export default Product;
