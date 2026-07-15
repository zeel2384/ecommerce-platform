import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(formData);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      if (data.user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (data.user.role === "vendor") {
        navigate("/vendor/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
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
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🛒</div>
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: "800",
              color: "var(--text)",
              marginBottom: "0.5rem",
            }}
          >
            Welcome Back!
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Login to your VendorMart account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
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
                transition: "border-color 0.2s",
              }}
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
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
              transition: "background-color 0.2s",
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login →"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link
            to="/forgot-password"
            style={{
              color: "#6366f1",
              fontWeight: "600",
              textDecoration: "none",
              fontSize: "14px",
              display: "block",
              marginBottom: "0.75rem",
            }}
          >
            Forgot Password?
          </Link>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "14px",
              margin: 0,
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#6366f1",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
