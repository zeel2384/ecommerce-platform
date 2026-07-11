import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../api";
import useViewport from "../../hooks/useViewport";
import toast from "react-hot-toast";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useViewport();

  const [step, setStep] = useState(1);
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
    window.scrollTo(0, 0);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);

    setTimeout(async () => {
      try {
        const items = cartItems.map((item) => ({
          product: item._id,
          vendor: item.vendor._id,
          name: item.name,
          image: item.images?.[0] || "",
          price: item.discountPrice || item.price,
          quantity: item.quantity,
        }));

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

  // Input style helper
  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    border: "1.5px solid var(--border)",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "var(--surface2)",
    color: "var(--text)",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "600",
    color: "var(--text)",
    fontSize: "14px",
  };

  // Order Success Screen
  if (orderPlaced) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--bg)",
          padding: "2rem",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--surface)",
            borderRadius: "20px",
            padding: isMobile ? "1.5rem" : "3rem",
            textAlign: "center",
            boxShadow: "var(--shadow-lg)",
            maxWidth: "500px",
            width: "100%",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🎉</div>
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: "800",
              color: "var(--text)",
              marginBottom: "1rem",
            }}
          >
            Order Placed Successfully!
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: "1rem",
              lineHeight: "1.6",
            }}
          >
            Thank you for your order! A confirmation email has been sent to{" "}
            {user?.email}
          </p>
          <div
            style={{
              backgroundColor: "var(--surface2)",
              padding: "0.75rem",
              borderRadius: "10px",
              fontSize: "14px",
              color: "var(--text-secondary)",
              marginBottom: "1.5rem",
              border: "1px solid var(--border)",
            }}
          >
            Order ID:{" "}
            <strong style={{ color: "var(--text)" }}>
              #{orderId?.slice(-8).toUpperCase()}
            </strong>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <button
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#6366f1",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "1rem",
                fontWeight: "700",
                cursor: "pointer",
              }}
              onClick={() => navigate("/my-orders")}
            >
              Track My Orders 📦
            </button>
            <button
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "transparent",
                color: "#6366f1",
                border: "2px solid #6366f1",
                borderRadius: "10px",
                fontSize: "1rem",
                fontWeight: "700",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
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
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: "800",
            color: "var(--text)",
            marginBottom: "1.5rem",
          }}
        >
          Checkout
        </h1>

        {/* Progress Steps */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          {["Delivery Address", "Payment", "Confirmation"].map((s, i) => (
            <div
              key={s}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  borderRadius: "25px",
                  backgroundColor: step >= i + 1 ? "#6366f1" : "var(--surface)",
                  border:
                    step >= i + 1
                      ? "2px solid #6366f1"
                      : "2px solid var(--border)",
                  color: step >= i + 1 ? "white" : "var(--text-secondary)",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                <span
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor:
                      step >= i + 1
                        ? "rgba(255,255,255,0.3)"
                        : "var(--surface2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "800",
                  }}
                >
                  {i + 1}
                </span>
                {s}
              </div>
              {i < 2 && <span style={{ color: "var(--text-muted)" }}>→</span>}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 340px",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* Left — Forms */}
          <div>
            {/* Step 1 — Address */}
            {step === 1 && (
              <div
                style={{
                  backgroundColor: "var(--surface)",
                  borderRadius: "16px",
                  padding: "2rem",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow)",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "800",
                    color: "var(--text)",
                    marginBottom: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  📍 Delivery Address
                </h2>
                <form onSubmit={handleAddressSubmit}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input
                        style={inputStyle}
                        type="text"
                        name="fullName"
                        value={address.fullName}
                        onChange={handleAddressChange}
                        required
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone *</label>
                      <input
                        style={inputStyle}
                        type="tel"
                        name="phone"
                        value={address.phone}
                        onChange={handleAddressChange}
                        required
                        placeholder="10 digit number"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={labelStyle}>Street Address *</label>
                    <input
                      style={inputStyle}
                      type="text"
                      name="street"
                      value={address.street}
                      onChange={handleAddressChange}
                      required
                      placeholder="House no, Street, Area"
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <label style={labelStyle}>City *</label>
                      <input
                        style={inputStyle}
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleAddressChange}
                        required
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>State *</label>
                      <input
                        style={inputStyle}
                        type="text"
                        name="state"
                        value={address.state}
                        onChange={handleAddressChange}
                        required
                        placeholder="State"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={labelStyle}>Pincode *</label>
                    <input
                      style={inputStyle}
                      type="text"
                      name="pincode"
                      value={address.pincode}
                      onChange={handleAddressChange}
                      required
                      placeholder="6 digit pincode"
                      maxLength={6}
                    />
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
                    }}
                    type="submit"
                  >
                    Continue to Payment →
                  </button>
                </form>
              </div>
            )}

            {/* Step 2 — Payment */}
            {step === 2 && (
              <div
                style={{
                  backgroundColor: "var(--surface)",
                  borderRadius: "16px",
                  padding: "2rem",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow)",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "800",
                    color: "var(--text)",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  💳 Payment Details
                </h2>

                <div
                  style={{
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #86efac",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "13px",
                    color: "#166534",
                    marginBottom: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  🔒 Secure Mock Payment — Test Mode
                </div>

                <form onSubmit={handlePayment}>
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={labelStyle}>Card Number *</label>
                    <input
                      style={inputStyle}
                      type="text"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardChange}
                      required
                      placeholder="4111 1111 1111 1111"
                      maxLength={19}
                    />
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={labelStyle}>Card Holder Name *</label>
                    <input
                      style={inputStyle}
                      type="text"
                      name="cardName"
                      value={cardData.cardName}
                      onChange={handleCardChange}
                      required
                      placeholder="Name on card"
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Expiry Date *</label>
                      <input
                        style={inputStyle}
                        type="text"
                        name="expiry"
                        value={cardData.expiry}
                        onChange={handleCardChange}
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>CVV *</label>
                      <input
                        style={inputStyle}
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

                  {/* Test card hint */}
                  <div
                    style={{
                      backgroundColor: "#fef9c3",
                      border: "1px solid #fde047",
                      borderRadius: "10px",
                      padding: "12px",
                      fontSize: "13px",
                      color: "#713f12",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <p style={{ fontWeight: "700", marginBottom: "4px" }}>
                      🧪 Test Card Details:
                    </p>
                    <p>Card: 4111 1111 1111 1111</p>
                    <p>Expiry: 12/26 | CVV: 123</p>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr",
                      gap: "1rem",
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        padding: "0.85rem",
                        backgroundColor: "var(--surface2)",
                        color: "var(--text-secondary)",
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        fontSize: "1rem",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                      onClick={() => setStep(1)}
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: "0.85rem",
                        backgroundColor: paymentLoading ? "#a5b4fc" : "#6366f1",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "1rem",
                        fontWeight: "700",
                        cursor: paymentLoading ? "not-allowed" : "pointer",
                      }}
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

          {/* Right — Order Summary */}
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
                fontSize: "1.1rem",
                fontWeight: "800",
                color: "var(--text)",
                marginBottom: "1rem",
              }}
            >
              Order Summary
            </h2>

            {cartItems.map((item) => (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  fontSize: "14px",
                }}
              >
                <span
                  style={{
                    color: "var(--text-secondary)",
                    flex: 1,
                    marginRight: "8px",
                  }}
                >
                  {item.name} ×{item.quantity}
                </span>
                <span
                  style={{
                    color: "var(--text)",
                    fontWeight: "600",
                  }}
                >
                  ₹
                  {(
                    (item.discountPrice || item.price) * item.quantity
                  ).toLocaleString()}
                </span>
              </div>
            ))}

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
                fontSize: "14px",
                color: "var(--text-secondary)",
                marginBottom: "8px",
              }}
            >
              <span>Subtotal</span>
              <span style={{ color: "var(--text)", fontWeight: "600" }}>
                ₹{cartTotal.toLocaleString()}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "14px",
                color: "var(--text-secondary)",
                marginBottom: "8px",
              }}
            >
              <span>Delivery</span>
              <span style={{ color: "#22c55e", fontWeight: "700" }}>FREE</span>
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
              }}
            >
              <span>Total</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>

            {/* Address Summary in Step 2 */}
            {step === 2 && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  backgroundColor: "var(--surface2)",
                  borderRadius: "10px",
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  lineHeight: "1.6",
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  style={{
                    fontWeight: "700",
                    color: "var(--text)",
                    marginBottom: "4px",
                  }}
                >
                  📍 Delivering to:
                </p>
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
    </div>
  );
};

export default Checkout;
