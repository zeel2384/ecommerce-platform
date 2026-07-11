import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import useViewport from "../../hooks/useViewport";
import toast from "react-hot-toast";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } =
    useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useViewport();

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
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--bg)",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🛒</div>
        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: "800",
            color: "var(--text)",
            marginBottom: "0.5rem",
          }}
        >
          Your cart is empty!
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "2rem",
            fontSize: "15px",
          }}
        >
          Add some products to your cart
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "0.75rem 2rem",
            backgroundColor: "#6366f1",
            color: "white",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "700",
            fontSize: "15px",
          }}
        >
          Continue Shopping →
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "var(--bg)",
        minHeight: "100vh",
        padding: isMobile ? "1rem" : "2rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "800",
            color: "var(--text)",
            marginBottom: "0.5rem",
          }}
        >
          Shopping Cart 🛒
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "2rem",
            fontSize: "15px",
          }}
        >
          {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your
          cart
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 350px",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* Cart Items */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {cartItems.map((item) => (
              <div
                key={item._id}
                style={{
                  backgroundColor: "var(--surface)",
                  borderRadius: "16px",
                  padding: "1.25rem",
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "70px 1fr"
                    : "90px 1fr auto auto",
                  gap: "1rem",
                  alignItems: "center",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow)",
                }}
              >
                {/* Product Image */}
                <div
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    backgroundColor: "var(--surface2)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
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
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2rem",
                      }}
                    >
                      📦
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div>
                  <Link
                    to={`/product/${item._id}`}
                    style={{
                      fontWeight: "700",
                      color: "var(--text)",
                      textDecoration: "none",
                      fontSize: "1rem",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    {item.name}
                  </Link>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#6366f1",
                      fontWeight: "600",
                      marginBottom: "6px",
                    }}
                  >
                    🏪 {item.vendor?.shopName || "Unknown Shop"}
                  </p>
                  <p
                    style={{
                      fontSize: "1rem",
                      fontWeight: "700",
                      color: "var(--text)",
                    }}
                  >
                    ₹{(item.discountPrice || item.price).toLocaleString()}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    backgroundColor: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: "4px 10px",
                    gridColumn: isMobile ? "1 / -1" : "auto",
                  }}
                >
                  <button
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--surface)",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text)",
                      padding: "0",
                    }}
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: "700",
                      minWidth: "24px",
                      textAlign: "center",
                      color: "var(--text)",
                    }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--surface)",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text)",
                      padding: "0",
                    }}
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                {/* Item Total + Remove */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMobile ? "flex-start" : "flex-end",
                    gap: "8px",
                    gridColumn: isMobile ? "1 / -1" : "auto",
                  }}
                >
                  <p
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "800",
                      color: "var(--text)",
                    }}
                  >
                    ₹
                    {(
                      (item.discountPrice || item.price) * item.quantity
                    ).toLocaleString()}
                  </p>
                  <button
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
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
              style={{
                backgroundColor: "transparent",
                border: "1px solid #ef4444",
                color: "#ef4444",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                alignSelf: "flex-start",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              onClick={() => {
                clearCart();
                toast.success("Cart cleared!");
              }}
            >
              🗑️ Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              borderRadius: "16px",
              padding: "1.5rem",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow)",
              position: isMobile ? "static" : "sticky",
              top: isMobile ? "auto" : "80px",
            }}
          >
            <h2
              style={{
                fontSize: "1.2rem",
                fontWeight: "800",
                color: "var(--text)",
                marginBottom: "1.5rem",
              }}
            >
              Order Summary
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
                fontSize: "14px",
                color: "var(--text-secondary)",
              }}
            >
              <span>Subtotal ({cartItems.length} items)</span>
              <span style={{ color: "var(--text)", fontWeight: "600" }}>
                ₹{cartTotal.toLocaleString()}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
                fontSize: "14px",
                color: "var(--text-secondary)",
              }}
            >
              <span>Delivery</span>
              <span style={{ color: "#22c55e", fontWeight: "700" }}>FREE</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
                fontSize: "14px",
                color: "var(--text-secondary)",
              }}
            >
              <span>Discount</span>
              <span style={{ color: "#ef4444", fontWeight: "600" }}>-₹0</span>
            </div>

            <div
              style={{
                borderTop: "1px solid var(--border)",
                margin: "1rem 0",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1.1rem",
                fontWeight: "800",
                color: "var(--text)",
                marginBottom: "1.5rem",
              }}
            >
              <span>Total Amount</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>

            <button
              style={{
                width: "100%",
                padding: "0.85rem",
                backgroundColor: "#6366f1",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "1rem",
                fontWeight: "700",
                cursor: "pointer",
                marginBottom: "1rem",
              }}
              onClick={handleCheckout}
            >
              Proceed to Checkout →
            </button>

            <Link
              to="/"
              style={{
                display: "block",
                textAlign: "center",
                color: "#6366f1",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
