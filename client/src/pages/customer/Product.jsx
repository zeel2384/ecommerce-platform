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
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
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
      <div
        style={{
          textAlign: "center",
          padding: "5rem",
          color: "var(--text-secondary)",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
        <p>Loading product...</p>
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
    <div
      style={{
        backgroundColor: "var(--bg)",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Breadcrumb */}
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "14px",
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{ cursor: "pointer", color: "#6366f1" }}
            onClick={() => navigate("/")}
          >
            Home
          </span>
          {" → "}
          <span>{product.category}</span>
          {" → "}
          <span style={{ color: "var(--text)" }}>{product.name}</span>
        </p>

        {/* Main Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            marginBottom: "3rem",
          }}
        >
          {/* Images */}
          <div>
            <div
              style={{
                height: "420px",
                backgroundColor: "var(--surface)",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid var(--border)",
                marginBottom: "1rem",
              }}
            >
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                    gap: "12px",
                  }}
                >
                  <span style={{ fontSize: "4rem" }}>📦</span>
                  <span>No Image Available</span>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div style={{ display: "flex", gap: "8px" }}>
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    style={{
                      width: "75px",
                      height: "75px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      cursor: "pointer",
                      border:
                        selectedImage === index
                          ? "3px solid #6366f1"
                          : "3px solid var(--border)",
                      transition: "border-color 0.2s",
                    }}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* Vendor */}
            <p
              style={{
                color: "#6366f1",
                fontWeight: "700",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              🏪 {product.vendor?.shopName}
            </p>

            {/* Name */}
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "800",
                color: "var(--text)",
                lineHeight: "1.2",
              }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "18px" }}>
                {"⭐".repeat(Math.round(product.rating || 0))}
              </span>
              <span
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                }}
              >
                {product.rating?.toFixed(1)} ({product.numReviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "1rem",
                backgroundColor: "var(--surface2)",
                borderRadius: "12px",
                border: "1px solid var(--border)",
              }}
            >
              {product.discountPrice > 0 ? (
                <>
                  <span
                    style={{
                      fontSize: "2.2rem",
                      fontWeight: "900",
                      color: "var(--text)",
                    }}
                  >
                    ₹{product.discountPrice.toLocaleString()}
                  </span>
                  <span
                    style={{
                      fontSize: "1.1rem",
                      color: "var(--text-muted)",
                      textDecoration: "line-through",
                    }}
                  >
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span
                    style={{
                      backgroundColor: "#ef4444",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: "700",
                    }}
                  >
                    {discount}% OFF
                  </span>
                </>
              ) : (
                <span
                  style={{
                    fontSize: "2.2rem",
                    fontWeight: "900",
                    color: "var(--text)",
                  }}
                >
                  ₹{product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p
              style={{
                color: "var(--text-secondary)",
                lineHeight: "1.7",
                fontSize: "15px",
              }}
            >
              {product.description}
            </p>

            {/* Category */}
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "14px",
              }}
            >
              Category:{" "}
              <span
                style={{
                  backgroundColor: "#ede9fe",
                  color: "#6366f1",
                  padding: "3px 10px",
                  borderRadius: "20px",
                  fontWeight: "600",
                  fontSize: "13px",
                }}
              >
                {product.category}
              </span>
            </p>

            {/* Stock */}
            <p
              style={{
                color: product.stock > 0 ? "#22c55e" : "#ef4444",
                fontWeight: "600",
                fontSize: "15px",
              }}
            >
              {product.stock > 0
                ? `✅ In Stock (${product.stock} available)`
                : "❌ Out of Stock"}
            </p>

            {/* Quantity */}
            {product.stock > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <span
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Quantity:
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: "4px 12px",
                  }}
                >
                  <button
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--surface2)",
                      fontSize: "18px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text)",
                      padding: "0",
                    }}
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  >
                    −
                  </button>
                  <span
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      minWidth: "30px",
                      textAlign: "center",
                      color: "var(--text)",
                    }}
                  >
                    {quantity}
                  </span>
                  <button
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--surface2)",
                      fontSize: "18px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text)",
                      padding: "0",
                    }}
                    onClick={() =>
                      setQuantity((prev) => Math.min(product.stock, prev + 1))
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <button
              style={{
                padding: "1rem 2rem",
                backgroundColor:
                  product.stock > 0 ? "#6366f1" : "var(--surface2)",
                color: product.stock > 0 ? "white" : "var(--text-muted)",
                border: "none",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: "700",
                cursor: product.stock > 0 ? "pointer" : "not-allowed",
                transition: "background-color 0.2s, transform 0.1s",
                marginTop: "0.5rem",
              }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              onMouseEnter={(e) => {
                if (product.stock > 0)
                  e.target.style.backgroundColor = "#4f46e5";
              }}
              onMouseLeave={(e) => {
                if (product.stock > 0)
                  e.target.style.backgroundColor = "#6366f1";
              }}
            >
              {product.stock > 0 ? "Add to Cart 🛒" : "Out of Stock"}
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "800",
              marginBottom: "1.5rem",
              color: "var(--text)",
            }}
          >
            Customer Reviews ({product.numReviews})
          </h2>

          {/* Add Review Form */}
          {isAuthenticated && isCustomer && (
            <div
              style={{
                backgroundColor: "var(--surface)",
                padding: "1.5rem",
                borderRadius: "16px",
                marginBottom: "2rem",
                border: "1px solid var(--border)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  marginBottom: "1rem",
                  color: "var(--text)",
                }}
              >
                ✍️ Write a Review
              </h3>
              <form onSubmit={handleReviewSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                      color: "var(--text)",
                      fontSize: "14px",
                    }}
                  >
                    Rating
                  </label>
                  <select
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      fontSize: "1rem",
                      outline: "none",
                      backgroundColor: "var(--surface2)",
                      color: "var(--text)",
                    }}
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
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                      color: "var(--text)",
                      fontSize: "14px",
                    }}
                  >
                    Comment
                  </label>
                  <textarea
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      fontSize: "1rem",
                      outline: "none",
                      resize: "vertical",
                      boxSizing: "border-box",
                      backgroundColor: "var(--surface2)",
                      color: "var(--text)",
                    }}
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
                  style={{
                    padding: "0.75rem 2rem",
                    backgroundColor: reviewLoading ? "#a5b4fc" : "#6366f1",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: reviewLoading ? "not-allowed" : "pointer",
                  }}
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
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {product.reviews.map((review, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "var(--surface)",
                    padding: "1.25rem",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: "#6366f1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "700",
                          fontSize: "16px",
                        }}
                      >
                        {review.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p
                          style={{
                            fontWeight: "700",
                            color: "var(--text)",
                            fontSize: "15px",
                          }}
                        >
                          {review.name}
                        </p>
                        <p
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "12px",
                          }}
                        >
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span style={{ fontSize: "16px" }}>
                      {"⭐".repeat(review.rating)}
                    </span>
                  </div>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      lineHeight: "1.6",
                      fontSize: "14px",
                    }}
                  >
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "var(--text-muted)",
                backgroundColor: "var(--surface)",
                borderRadius: "12px",
                border: "1px solid var(--border)",
              }}
            >
              <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>💬</p>
              <p>No reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
