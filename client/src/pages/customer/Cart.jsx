import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } =
    useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please login to checkout!");
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <p style={styles.emptyIcon}>🛒</p>
        <h2 style={styles.emptyTitle}>Your cart is empty!</h2>
        <p style={styles.emptySubtitle}>Add some products to your cart</p>
        <Link to="/" style={styles.shopBtn}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Shopping Cart 🛒</h1>
      <p style={styles.subtitle}>{cartItems.length} items in your cart</p>

      <div style={styles.layout}>
        {/* Cart Items */}
        <div style={styles.itemsSection}>
          {cartItems.map((item) => (
            <div key={item._id} style={styles.cartItem}>
              {/* Product Image */}
              <div style={styles.itemImage}>
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    style={styles.image}
                  />
                ) : (
                  <div style={styles.noImage}>📦</div>
                )}
              </div>

              {/* Product Info */}
              <div style={styles.itemInfo}>
                <Link to={`/product/${item._id}`} style={styles.itemName}>
                  {item.name}
                </Link>
                <p style={styles.itemVendor}>
                  🏪 {item.vendor?.shopName || "Unknown Shop"}
                </p>
                <p style={styles.itemPrice}>
                  ₹{(item.discountPrice || item.price).toLocaleString()}
                </p>
              </div>

              {/* Quantity Controls */}
              <div style={styles.quantityContainer}>
                <button
                  style={styles.qtyBtn}
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                >
                  −
                </button>
                <span style={styles.qtyValue}>{item.quantity}</span>
                <button
                  style={styles.qtyBtn}
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              {/* Item Total */}
              <div style={styles.itemTotal}>
                <p style={styles.totalPrice}>
                  ₹
                  {(
                    (item.discountPrice || item.price) * item.quantity
                  ).toLocaleString()}
                </p>
                <button
                  style={styles.removeBtn}
                  onClick={() => {
                    removeFromCart(item._id);
                    toast.success("Item removed from cart");
                  }}
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          ))}

          {/* Clear Cart */}
          <button
            style={styles.clearBtn}
            onClick={() => {
              clearCart();
              toast.success("Cart cleared!");
            }}
          >
            🗑️ Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div style={styles.summary}>
          <h2 style={styles.summaryTitle}>Order Summary</h2>

          <div style={styles.summaryRow}>
            <span>Subtotal ({cartItems.length} items)</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>

          <div style={styles.summaryRow}>
            <span>Delivery</span>
            <span style={styles.freeDelivery}>FREE</span>
          </div>

          <div style={styles.summaryRow}>
            <span>Discount</span>
            <span style={styles.discount}>-₹0</span>
          </div>

          <div style={styles.divider} />

          <div style={styles.totalRow}>
            <span>Total Amount</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>

          <button style={styles.checkoutBtn} onClick={handleCheckout}>
            Proceed to Checkout →
          </button>

          <Link to="/" style={styles.continueBtn}>
            ← Continue Shopping
          </Link>
        </div>
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
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#666",
    marginBottom: "2rem",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 350px",
    gap: "2rem",
    alignItems: "start",
  },
  itemsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  cartItem: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1rem",
    display: "grid",
    gridTemplateColumns: "80px 1fr auto auto",
    gap: "1rem",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  itemImage: {
    width: "80px",
    height: "80px",
    borderRadius: "8px",
    overflow: "hidden",
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
  },
  itemInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  itemName: {
    fontWeight: "600",
    color: "#333",
    textDecoration: "none",
    fontSize: "1rem",
  },
  itemVendor: {
    fontSize: "12px",
    color: "#6366f1",
  },
  itemPrice: {
    fontSize: "1rem",
    fontWeight: "500",
    color: "#333",
  },
  quantityContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  qtyBtn: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "1px solid #e5e7eb",
    backgroundColor: "white",
    fontSize: "18px",
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
    fontSize: "1rem",
    fontWeight: "600",
    minWidth: "24px",
    textAlign: "center",
  },
  itemTotal: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px",
  },
  totalPrice: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#333",
  },
  removeBtn: {
    backgroundColor: "transparent",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
  },
  clearBtn: {
    backgroundColor: "transparent",
    border: "1px solid #ef4444",
    color: "#ef4444",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    alignSelf: "flex-start",
  },
  summary: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    position: "sticky",
    top: "80px",
  },
  summaryTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "1.5rem",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1rem",
    fontSize: "14px",
    color: "#555",
  },
  freeDelivery: {
    color: "#22c55e",
    fontWeight: "600",
  },
  discount: {
    color: "#ef4444",
    fontWeight: "600",
  },
  divider: {
    borderTop: "1px solid #e5e7eb",
    margin: "1rem 0",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "1.5rem",
  },
  checkoutBtn: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "1rem",
  },
  continueBtn: {
    display: "block",
    textAlign: "center",
    color: "#6366f1",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
  },
  emptyContainer: {
    textAlign: "center",
    padding: "5rem 2rem",
  },
  emptyIcon: {
    fontSize: "5rem",
    marginBottom: "1rem",
  },
  emptyTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "0.5rem",
  },
  emptySubtitle: {
    color: "#666",
    marginBottom: "2rem",
  },
  shopBtn: {
    display: "inline-block",
    padding: "0.75rem 2rem",
    backgroundColor: "#6366f1",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Cart;
