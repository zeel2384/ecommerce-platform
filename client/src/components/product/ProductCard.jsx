import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const added = addToCart(product);
    if (added) {
      toast.success(`${product.name} added to cart! 🛒`);
    }
  };

  const discount =
    product.discountPrice > 0
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100,
        )
      : 0;

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        borderRadius: "16px",
        boxShadow: "var(--shadow)",
        border: "1px solid var(--border)",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow)";
      }}
    >
      {/* Product Image */}
      <Link to={`/product/${product._id}`}>
        <div
          style={{
            position: "relative",
            height: "220px",
            backgroundColor: "var(--surface2)",
            overflow: "hidden",
          }}
        >
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
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
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "3rem" }}>📦</span>
              <span style={{ fontSize: "14px" }}>No Image</span>
            </div>
          )}
          {discount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                backgroundColor: "#ef4444",
                color: "white",
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              {discount}% OFF
            </span>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div style={{ padding: "1rem" }}>
        {/* Vendor name */}
        <p
          style={{
            fontSize: "12px",
            color: "#6366f1",
            marginBottom: "6px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          🏪 {product.vendor?.shopName || "Unknown Shop"}
        </p>

        {/* Product name */}
        <Link
          to={`/product/${product._id}`}
          style={{
            fontSize: "1rem",
            fontWeight: "700",
            color: "var(--text)",
            textDecoration: "none",
            display: "block",
            marginBottom: "8px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div
          style={{
            marginBottom: "10px",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span>{"⭐".repeat(Math.round(product.rating || 0))}</span>
          <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>
            ({product.numReviews || 0} reviews)
          </span>
        </div>

        {/* Price */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          {product.discountPrice > 0 ? (
            <>
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "800",
                  color: "var(--text)",
                }}
              >
                ₹{product.discountPrice.toLocaleString()}
              </span>
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  textDecoration: "line-through",
                }}
              >
                ₹{product.price.toLocaleString()}
              </span>
            </>
          ) : (
            <span
              style={{
                fontSize: "1.2rem",
                fontWeight: "800",
                color: "var(--text)",
              }}
            >
              ₹{product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock status */}
        <p
          style={{
            fontSize: "12px",
            color: product.stock > 0 ? "#22c55e" : "#ef4444",
            marginBottom: "12px",
            fontWeight: "500",
          }}
        >
          {product.stock > 0
            ? `✅ In Stock (${product.stock})`
            : "❌ Out of Stock"}
        </p>

        {/* Add to cart button */}
        <button
          style={{
            width: "100%",
            padding: "0.65rem",
            backgroundColor: product.stock > 0 ? "#6366f1" : "var(--surface2)",
            color: product.stock > 0 ? "white" : "var(--text-muted)",
            border: "none",
            borderRadius: "10px",
            fontSize: "0.9rem",
            fontWeight: "700",
            cursor: product.stock > 0 ? "pointer" : "not-allowed",
            transition: "background-color 0.2s, transform 0.1s",
          }}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          onMouseEnter={(e) => {
            if (product.stock > 0) e.target.style.backgroundColor = "#4f46e5";
          }}
          onMouseLeave={(e) => {
            if (product.stock > 0) e.target.style.backgroundColor = "#6366f1";
          }}
        >
          {product.stock > 0 ? "Add to Cart 🛒" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
