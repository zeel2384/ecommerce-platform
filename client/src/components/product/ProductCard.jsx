import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const discount =
    product.discountPrice > 0
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100,
        )
      : 0;

  return (
    <div style={styles.card}>
      {/* Product Image */}
      <Link to={`/product/${product._id}`}>
        <div style={styles.imageContainer}>
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              style={styles.image}
            />
          ) : (
            <div style={styles.noImage}>📦 No Image</div>
          )}
          {discount > 0 && (
            <span style={styles.discountBadge}>{discount}% OFF</span>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div style={styles.info}>
        {/* Vendor name */}
        <p style={styles.vendorName}>
          🏪 {product.vendor?.shopName || "Unknown Shop"}
        </p>

        {/* Product name */}
        <Link to={`/product/${product._id}`} style={styles.productName}>
          {product.name}
        </Link>

        {/* Rating */}
        <div style={styles.rating}>
          {"⭐".repeat(Math.round(product.rating || 0))}
          <span style={styles.ratingText}>
            ({product.numReviews || 0} reviews)
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
            </>
          ) : (
            <span style={styles.discountPrice}>
              ₹{product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock status */}
        <p style={product.stock > 0 ? styles.inStock : styles.outOfStock}>
          {product.stock > 0
            ? `✅ In Stock (${product.stock})`
            : "❌ Out of Stock"}
        </p>

        {/* Add to cart button */}
        <button
          style={product.stock > 0 ? styles.button : styles.buttonDisabled}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock > 0 ? "Add to Cart 🛒" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    overflow: "hidden",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  imageContainer: {
    position: "relative",
    height: "200px",
    backgroundColor: "#f5f5f5",
  },
  image: {
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
    fontSize: "2rem",
    color: "#999",
  },
  discountBadge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "#ef4444",
    color: "white",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  info: {
    padding: "1rem",
  },
  vendorName: {
    fontSize: "12px",
    color: "#6366f1",
    marginBottom: "4px",
    fontWeight: "500",
  },
  productName: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#333",
    textDecoration: "none",
    display: "block",
    marginBottom: "8px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  rating: {
    marginBottom: "8px",
    fontSize: "14px",
  },
  ratingText: {
    color: "#666",
    fontSize: "12px",
    marginLeft: "4px",
  },
  priceContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
  },
  discountPrice: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#333",
  },
  originalPrice: {
    fontSize: "0.9rem",
    color: "#999",
    textDecoration: "line-through",
  },
  inStock: {
    fontSize: "12px",
    color: "#22c55e",
    marginBottom: "8px",
  },
  outOfStock: {
    fontSize: "12px",
    color: "#ef4444",
    marginBottom: "8px",
  },
  button: {
    width: "100%",
    padding: "0.6rem",
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  buttonDisabled: {
    width: "100%",
    padding: "0.6rem",
    backgroundColor: "#e5e7eb",
    color: "#9ca3af",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "not-allowed",
  },
};

export default ProductCard;
