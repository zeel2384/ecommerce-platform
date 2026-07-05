import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../api";
import toast from "react-hot-toast";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);

    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Build order items from cart
        const items = cartItems.map((item) => ({
          product: item._id,
          vendor: item.vendor._id,
          name: item.name,
          image: item.images?.[0] || "",
          price: item.discountPrice || item.price,
          quantity: item.quantity,
        }));

        // Create order
        const { data } = await createOrder({
          items,
          deliveryAddress: address,
          totalAmount: cartTotal,
        });

        setOrderId(data.order._id);
        setOrderPlaced(true);
        clearCart();
        toast.success("Order placed successfully! 🎉");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to place order");
      } finally {
        setPaymentLoading(false);
      }
    }, 2000);
  };

  // Order Success Screen
  if (orderPlaced) {
    return (
      <div style={styles.successContainer}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>🎉</div>
          <h1 style={styles.successTitle}>Order Placed Successfully!</h1>
          <p style={styles.successSubtitle}>
            Thank you for your order! A confirmation email has been sent to{" "}
            {user?.email}
          </p>
          <div style={styles.orderId}>
            Order ID: <strong>#{orderId}</strong>
          </div>
          <div style={styles.successButtons}>
            <button
              style={styles.trackBtn}
              onClick={() => navigate("/my-orders")}
            >
              Track My Orders
            </button>
            <button style={styles.shopBtn} onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Checkout</h1>

      {/* Progress Steps */}
      <div style={styles.steps}>
        <div style={step >= 1 ? styles.stepActive : styles.step}>
          1. Delivery Address
        </div>
        <div style={styles.stepDivider}>→</div>
        <div style={step >= 2 ? styles.stepActive : styles.step}>
          2. Payment
        </div>
        <div style={styles.stepDivider}>→</div>
        <div style={step >= 3 ? styles.stepActive : styles.step}>
          3. Confirmation
        </div>
      </div>

      <div style={styles.layout}>
        {/* Left Side — Forms */}
        <div style={styles.formSection}>
          {/* Step 1 — Address */}
          {step === 1 && (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>📍 Delivery Address</h2>
              <form onSubmit={handleAddressSubmit}>
                <div style={styles.row}>
                  <div style={styles.field}>
                    <label style={styles.label}>Full Name *</label>
                    <input
                      style={styles.input}
                      type="text"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleAddressChange}
                      required
                      placeholder="Enter full name"
                    />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Phone *</label>
                    <input
                      style={styles.input}
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleAddressChange}
                      required
                      placeholder="10 digit number"
                    />
                  </div>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Street Address *</label>
                  <input
                    style={styles.input}
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    required
                    placeholder="House no, Street, Area"
                  />
                </div>

                <div style={styles.row}>
                  <div style={styles.field}>
                    <label style={styles.label}>City *</label>
                    <input
                      style={styles.input}
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      required
                      placeholder="City"
                    />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>State *</label>
                    <input
                      style={styles.input}
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      required
                      placeholder="State"
                    />
                  </div>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Pincode *</label>
                  <input
                    style={styles.input}
                    type="text"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleAddressChange}
                    required
                    placeholder="6 digit pincode"
                    maxLength={6}
                  />
                </div>

                <button style={styles.button} type="submit">
                  Continue to Payment →
                </button>
              </form>
            </div>
          )}

          {/* Step 2 — Payment */}
          {step === 2 && (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>💳 Payment Details</h2>
              <div style={styles.mockBadge}>
                🔒 Secure Mock Payment — Test Mode
              </div>

              <form onSubmit={handlePayment}>
                <div style={styles.field}>
                  <label style={styles.label}>Card Number *</label>
                  <input
                    style={styles.input}
                    type="text"
                    name="cardNumber"
                    value={cardData.cardNumber}
                    onChange={handleCardChange}
                    required
                    placeholder="4111 1111 1111 1111"
                    maxLength={19}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Card Holder Name *</label>
                  <input
                    style={styles.input}
                    type="text"
                    name="cardName"
                    value={cardData.cardName}
                    onChange={handleCardChange}
                    required
                    placeholder="Name on card"
                  />
                </div>

                <div style={styles.row}>
                  <div style={styles.field}>
                    <label style={styles.label}>Expiry Date *</label>
                    <input
                      style={styles.input}
                      type="text"
                      name="expiry"
                      value={cardData.expiry}
                      onChange={handleCardChange}
                      required
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>CVV *</label>
                    <input
                      style={styles.input}
                      type="password"
                      name="cvv"
                      value={cardData.cvv}
                      onChange={handleCardChange}
                      required
                      placeholder="123"
                      maxLength={3}
                    />
                  </div>
                </div>

                <div style={styles.testCard}>
                  <p style={styles.testCardTitle}>🧪 Test Card Details:</p>
                  <p>Card: 4111 1111 1111 1111</p>
                  <p>Expiry: 12/26 | CVV: 123</p>
                </div>

                <div style={styles.buttonRow}>
                  <button
                    type="button"
                    style={styles.backBtn}
                    onClick={() => setStep(1)}
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    style={
                      paymentLoading ? styles.buttonDisabled : styles.button
                    }
                    disabled={paymentLoading}
                  >
                    {paymentLoading
                      ? "Processing Payment... ⏳"
                      : `Pay ₹${cartTotal.toLocaleString()} 🔒`}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Side — Order Summary */}
        <div style={styles.summary}>
          <h2 style={styles.summaryTitle}>Order Summary</h2>

          {cartItems.map((item) => (
            <div key={item._id} style={styles.summaryItem}>
              <span style={styles.itemName}>
                {item.name} x{item.quantity}
              </span>
              <span style={styles.itemPrice}>
                ₹
                {(
                  (item.discountPrice || item.price) * item.quantity
                ).toLocaleString()}
              </span>
            </div>
          ))}

          <div style={styles.divider} />

          <div style={styles.summaryRow}>
            <span>Subtotal</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Delivery</span>
            <span style={styles.free}>FREE</span>
          </div>

          <div style={styles.divider} />

          <div style={styles.totalRow}>
            <span>Total</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>

          {/* Address Summary in Step 2 */}
          {step === 2 && (
            <div style={styles.addressSummary}>
              <p style={styles.addressTitle}>📍 Delivering to:</p>
              <p>{address.fullName}</p>
              <p>{address.street}</p>
              <p>
                {address.city}, {address.state} - {address.pincode}
              </p>
              <p>📞 {address.phone}</p>
            </div>
          )}
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
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "1.5rem",
  },
  steps: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "2rem",
  },
  step: {
    padding: "8px 16px",
    borderRadius: "25px",
    backgroundColor: "#e5e7eb",
    color: "#666",
    fontSize: "14px",
    fontWeight: "500",
  },
  stepActive: {
    padding: "8px 16px",
    borderRadius: "25px",
    backgroundColor: "#6366f1",
    color: "white",
    fontSize: "14px",
    fontWeight: "600",
  },
  stepDivider: {
    color: "#999",
    fontSize: "18px",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 350px",
    gap: "2rem",
    alignItems: "start",
  },
  formSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  cardTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "1.5rem",
  },
  mockBadge: {
    backgroundColor: "#f0fdf4",
    border: "1px solid #86efac",
    color: "#166534",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  field: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "500",
    color: "#333",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
    color: "#333",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "1rem",
  },
  buttonDisabled: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#a5b4fc",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "not-allowed",
    marginTop: "1rem",
  },
  buttonRow: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "1rem",
    marginTop: "1rem",
  },
  backBtn: {
    padding: "0.75rem",
    backgroundColor: "transparent",
    color: "#666",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  testCard: {
    backgroundColor: "#fef9c3",
    border: "1px solid #fde047",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "13px",
    color: "#713f12",
    marginTop: "1rem",
  },
  testCardTitle: {
    fontWeight: "600",
    marginBottom: "4px",
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
    marginBottom: "1rem",
  },
  summaryItem: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "14px",
    color: "#555",
  },
  itemName: {
    flex: 1,
    marginRight: "8px",
  },
  itemPrice: {
    fontWeight: "500",
    color: "#333",
  },
  divider: {
    borderTop: "1px solid #e5e7eb",
    margin: "1rem 0",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#555",
    marginBottom: "8px",
  },
  free: {
    color: "#22c55e",
    fontWeight: "600",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#333",
  },
  addressSummary: {
    marginTop: "1rem",
    padding: "1rem",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.6",
  },
  addressTitle: {
    fontWeight: "600",
    color: "#333",
    marginBottom: "4px",
  },
  successContainer: {
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  successCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "3rem",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    maxWidth: "500px",
    width: "100%",
  },
  successIcon: {
    fontSize: "4rem",
    marginBottom: "1rem",
  },
  successTitle: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "1rem",
  },
  successSubtitle: {
    color: "#666",
    marginBottom: "1rem",
    lineHeight: "1.6",
  },
  orderId: {
    backgroundColor: "#f9fafb",
    padding: "0.75rem",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#555",
    marginBottom: "1.5rem",
  },
  successButtons: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
  },
  trackBtn: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  shopBtn: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "transparent",
    color: "#6366f1",
    border: "1px solid #6366f1",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Checkout;
