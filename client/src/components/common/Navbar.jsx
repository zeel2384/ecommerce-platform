import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, isAuthenticated, logout, isVendor, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <Link to="/" style={styles.logo}>
        🛒 VendorMart
      </Link>

      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <input
          style={styles.searchInput}
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
      <div style={styles.rightSection}>
        {/* Cart - only show for customers */}
        {!isAdmin && (
          <Link to="/cart" style={styles.cartBtn}>
            🛒
            {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
          </Link>
        )}

        {isAuthenticated ? (
          <>
            {/* Dashboard link based on role */}
            {isAdmin && (
              <Link to="/admin/dashboard" style={styles.navLink}>
                Admin
              </Link>
            )}
            {isVendor && (
              <Link to="/vendor/dashboard" style={styles.navLink}>
                Dashboard
              </Link>
            )}

            {/* User name */}
            <span style={styles.userName}>
              Hi, {user?.name?.split(" ")[0]}!
            </span>

            {/* Logout */}
            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.navLink}>
              Login
            </Link>
            <Link to="/register" style={styles.registerBtn}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 2rem",
    backgroundColor: "#6366f1",
    color: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "white",
    textDecoration: "none",
  },
  searchContainer: {
    flex: 1,
    maxWidth: "400px",
    margin: "0 2rem",
  },
  searchInput: {
    width: "100%",
    padding: "0.5rem 1rem",
    borderRadius: "25px",
    border: "none",
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  cartBtn: {
    position: "relative",
    fontSize: "1.5rem",
    textDecoration: "none",
    cursor: "pointer",
  },
  cartBadge: {
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
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
  },
  registerBtn: {
    backgroundColor: "white",
    color: "#6366f1",
    padding: "0.4rem 1rem",
    borderRadius: "25px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  userName: {
    color: "white",
    fontWeight: "500",
  },
  logoutBtn: {
    backgroundColor: "transparent",
    color: "white",
    border: "1px solid white",
    padding: "0.4rem 1rem",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "500",
  },
};

export default Navbar;
