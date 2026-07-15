import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../../api";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ email, password: formData.password });
      toast.success("Password reset successfully! Please login. ✅");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

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
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🔒</div>

        {/* Title */}
        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: "800",
            color: "var(--text)",
            marginBottom: "0.5rem",
          }}
        >
          Reset Password
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "14px",
            marginBottom: "2rem",
          }}
        >
          Create a new strong password for your account
        </p>

        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div style={{ marginBottom: "1.25rem", textAlign: "left" }}>
            <label style={labelStyle}>New Password</label>
            <input
              style={inputStyle}
              type="password"
              name="password"
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
            <label style={labelStyle}>Confirm Password</label>
            <input
              style={inputStyle}
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {/* Password match indicator */}
            {formData.confirmPassword && (
              <p
                style={{
                  fontSize: "13px",
                  marginTop: "6px",
                  color:
                    formData.password === formData.confirmPassword
                      ? "#22c55e"
                      : "#ef4444",
                }}
              >
                {formData.password === formData.confirmPassword
                  ? "✅ Passwords match"
                  : "❌ Passwords do not match"}
              </p>
            )}
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
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password 🔒"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
