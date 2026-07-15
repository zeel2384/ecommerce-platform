import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { forgotPassword } from "../../api";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword({ email });
      toast.success("OTP sent to your email! 📧");
      navigate("/verify-forgot-otp", { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--surface)",
          padding: "2.5rem",
          borderRadius: "16px",
          boxShadow: "var(--shadow-lg)",
          width: "100%",
          maxWidth: "420px",
          border: "1px solid var(--border)",
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🔐</div>

        {/* Title */}
        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: "800",
            color: "var(--text)",
            marginBottom: "0.5rem",
          }}
        >
          Forgot Password?
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "14px",
            marginBottom: "2rem",
          }}
        >
          Enter your email and we'll send you an OTP to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "600",
                color: "var(--text)",
                fontSize: "14px",
              }}
            >
              Email Address
            </label>
            <input
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                border: "1.5px solid var(--border)",
                fontSize: "1rem",
                outline: "none",
                boxSizing: "border-box",
                backgroundColor: "var(--surface2)",
                color: "var(--text)",
              }}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            style={{
              width: "100%",
              padding: "0.85rem",
              backgroundColor: loading ? "#a5b4fc" : "#6366f1",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: "1rem",
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP 📧"}
          </button>
        </form>

        <Link
          to="/login"
          style={{
            color: "#6366f1",
            fontWeight: "700",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          ← Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
