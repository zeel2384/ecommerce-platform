import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Remove useAuth import - we don't need it anymore
// import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../api";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [loading, setLoading] = useState(false);
  // Remove: const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Register now sends OTP first
      await registerUser(formData);
      toast.success("OTP sent to your email! 🎉");
      navigate("/verify-otp", { state: { email: formData.email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
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
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🚀</div>
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: "800",
              color: "var(--text)",
              marginBottom: "0.5rem",
            }}
          >
            Create Account
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Join VendorMart today — it's free!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "600",
                color: "var(--text)",
                fontSize: "14px",
              }}
            >
              Full Name
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
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "1.25rem" }}>
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
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "600",
                color: "var(--text)",
                fontSize: "14px",
              }}
            >
              Password
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
              type="password"
              name="password"
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "600",
                color: "var(--text)",
                fontSize: "14px",
              }}
            >
              Register as
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
              }}
            >
              {["customer", "vendor"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({ ...formData, role })}
                  style={{
                    padding: "0.75rem",
                    borderRadius: "10px",
                    border:
                      formData.role === role
                        ? "2px solid #6366f1"
                        : "2px solid var(--border)",
                    backgroundColor:
                      formData.role === role ? "#ede9fe" : "var(--surface2)",
                    color:
                      formData.role === role
                        ? "#6366f1"
                        : "var(--text-secondary)",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "14px",
                    textTransform: "capitalize",
                  }}
                >
                  {role === "customer" ? "🛍️ Customer" : "🏪 Vendor"}
                </button>
              ))}
            </div>
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
            {loading ? "Creating account..." : "Create Account 🚀"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            color: "var(--text-secondary)",
            fontSize: "14px",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#6366f1",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
