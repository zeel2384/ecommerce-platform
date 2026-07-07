import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, isAuthenticated, logout, isVendor, isAdmin, isCustomer } =
    useAuth();
  const { cartCount } = useCart();
  const { isDark, toggleTheme, colors } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        height: "64px",
        backgroundColor: colors.primary,
        color: "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          fontSize: "1.4rem",
          fontWeight: "800",
          color: "white",
          textDecoration: "none",
          letterSpacing: "-0.5px",
        }}
      >
        🛒 VendorMart
      </Link>

      {/* Search Bar */}
      <div style={{ flex: 1, maxWidth: "400px", margin: "0 2rem" }}>
        <input
          style={{
            width: "100%",
            padding: "0.5rem 1rem",
            borderRadius: "25px",
            border: "none",
            fontSize: "0.9rem",
            outline: "none",
            boxSizing: "border-box",
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "white",
          }}
          type="text"
          placeholder="Search products..."
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              navigate(`/?keyword=${e.target.value}`);
            }
          }}
        />
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            cursor: "pointer",
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        {/* Cart - only for customers */}
        {!isAdmin && (
          <Link
            to="/cart"
            style={{
              position: "relative",
              fontSize: "1.3rem",
              textDecoration: "none",
            }}
          >
            🛒
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  fontSize: "11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>
        )}

        {isAuthenticated ? (
          <>
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Admin
              </Link>
            )}
            {isCustomer && (
              <Link
                to="/my-orders"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                My Orders
              </Link>
            )}
            {isVendor && (
              <Link
                to="/vendor/dashboard"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Dashboard
              </Link>
            )}
            <span
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Hi, {user?.name?.split(" ")[0]}!
            </span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                padding: "0.4rem 1rem",
                borderRadius: "25px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                color: "white",
                textDecoration: "none",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                backgroundColor: "white",
                color: colors.primary,
                padding: "0.4rem 1rem",
                borderRadius: "25px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
