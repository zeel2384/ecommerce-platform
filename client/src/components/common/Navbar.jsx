import { useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav
      style={{
        backgroundColor: colors.primary,
        color: "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Main navbar row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          height: "64px",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontSize: "1.3rem",
            fontWeight: "800",
            color: "white",
            textDecoration: "none",
            letterSpacing: "-0.5px",
            flexShrink: 0,
          }}
        >
          🛒 VendorMart
        </Link>

        {/* Search Bar — hidden on mobile */}
        <div
          style={{
            flex: 1,
            maxWidth: "400px",
            margin: "0 1.5rem",
            display: window.innerWidth < 768 ? "none" : "block",
          }}
        >
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
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
              flexShrink: 0,
            }}
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {/* Cart */}
          {!isAdmin && (
            <Link
              to="/cart"
              style={{
                position: "relative",
                fontSize: "1.3rem",
                textDecoration: "none",
                flexShrink: 0,
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

          {/* Desktop menu */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
            className="desktop-menu"
          >
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
                      whiteSpace: "nowrap",
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
                      whiteSpace: "nowrap",
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
                      whiteSpace: "nowrap",
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
                    whiteSpace: "nowrap",
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
                    whiteSpace: "nowrap",
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
                    whiteSpace: "nowrap",
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Hamburger menu button — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "8px",
              width: "36px",
              height: "36px",
              cursor: "pointer",
              fontSize: "1.2rem",
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
            className="hamburger"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      <div
        className="mobile-search"
        style={{
          display: "none",
          padding: "0 1rem 10px",
        }}
      >
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

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          style={{
            backgroundColor: "#5558e3",
            padding: "1rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            borderTop: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    fontWeight: "600",
                    fontSize: "15px",
                    padding: "0.5rem 0",
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  👑 Admin Dashboard
                </Link>
              )}
              {isCustomer && (
                <Link
                  to="/my-orders"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    fontWeight: "600",
                    fontSize: "15px",
                    padding: "0.5rem 0",
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  📦 My Orders
                </Link>
              )}
              {isVendor && (
                <Link
                  to="/vendor/dashboard"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    fontWeight: "600",
                    fontSize: "15px",
                    padding: "0.5rem 0",
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  🏪 Vendor Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                  padding: "0.6rem 1rem",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "15px",
                  textAlign: "left",
                }}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "15px",
                  padding: "0.5rem 0",
                }}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  backgroundColor: "white",
                  color: "#6366f1",
                  padding: "0.6rem 1rem",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: "700",
                  fontSize: "15px",
                  textAlign: "center",
                }}
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
