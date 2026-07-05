import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getVendorProfile, getProducts } from "../../api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const VendorDashboard = () => {
  const { user } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data } = await getVendorProfile();
      setVendor(data.vendor);

      // Fetch vendor products
      const productsRes = await getProducts({});
      const vendorProducts = productsRes.data.products.filter(
        (p) => p.vendor._id === data.vendor._id,
      );
      setProducts(vendorProducts);
    } catch (error) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <p>Loading dashboard... ⏳</p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div style={styles.noShop}>
        <h2>You don't have a shop yet!</h2>
        <p>Setup your shop to start selling</p>
        <Link to="/vendor/setup" style={styles.setupBtn}>
          Setup Shop
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p style={styles.subtitle}>
            🏪 {vendor.shopName}
            {!vendor.isApproved && (
              <span style={styles.pendingBadge}>⏳ Pending Approval</span>
            )}
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/vendor/orders" style={styles.ordersBtn}>
            📦 View Orders
          </Link>
          <Link to="/vendor/add-product" style={styles.addBtn}>
            + Add Product
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Products</p>
          <p style={styles.statValue}>{vendor.totalProducts}</p>
          <p style={styles.statIcon}>📦</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Orders</p>
          <p style={styles.statValue}>{vendor.totalOrders}</p>
          <p style={styles.statIcon}>🛒</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Revenue</p>
          <p style={styles.statValue}>
            ₹{vendor.totalRevenue.toLocaleString()}
          </p>
          <p style={styles.statIcon}>💰</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Shop Status</p>
          <p style={styles.statValue}>
            {vendor.isApproved ? "✅ Active" : "⏳ Pending"}
          </p>
          <p style={styles.statIcon}>🏪</p>
        </div>
      </div>

      {/* Products Table */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Your Products</h2>
          <Link to="/vendor/add-product" style={styles.addBtnSmall}>
            + Add New
          </Link>
        </div>

        {products.length === 0 ? (
          <div style={styles.empty}>
            <p>📦 No products yet</p>
            <p>Add your first product to start selling!</p>
            <Link to="/vendor/add-product" style={styles.setupBtn}>
              Add Product
            </Link>
          </div>
        ) : (
          <div style={styles.table}>
            {/* Table Header */}
            <div style={styles.tableHeader}>
              <span>Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Stock</span>
              <span>Status</span>
            </div>

            {/* Table Rows */}
            {products.map((product) => (
              <div key={product._id} style={styles.tableRow}>
                <span style={styles.productName}>{product.name}</span>
                <span style={styles.tableCell}>{product.category}</span>
                <span style={styles.tableCell}>
                  ₹{product.price.toLocaleString()}
                </span>
                <span style={styles.tableCell}>{product.stock}</span>
                <span
                  style={product.stock > 0 ? styles.inStock : styles.outOfStock}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            ))}
          </div>
        )}
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
  loading: {
    textAlign: "center",
    padding: "3rem",
    color: "#666",
  },
  noShop: {
    textAlign: "center",
    padding: "5rem 2rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#666",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  pendingBadge: {
    backgroundColor: "#fef3c7",
    color: "#d97706",
    padding: "2px 8px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
  },
  addBtn: {
    backgroundColor: "#6366f1",
    color: "white",
    padding: "0.6rem 1.2rem",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
  },
  addBtnSmall: {
    backgroundColor: "#6366f1",
    color: "white",
    padding: "0.4rem 1rem",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "13px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1rem",
    marginBottom: "2rem",
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    position: "relative",
    overflow: "hidden",
  },
  statLabel: {
    fontSize: "13px",
    color: "#666",
    marginBottom: "0.5rem",
  },
  statValue: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#333",
  },
  statIcon: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    fontSize: "2rem",
    opacity: 0.3,
  },
  section: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  sectionTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#333",
  },
  empty: {
    textAlign: "center",
    padding: "2rem",
    color: "#666",
  },
  table: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
    padding: "0.75rem 1rem",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#666",
    marginBottom: "0.5rem",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
    padding: "0.75rem 1rem",
    borderBottom: "1px solid #f3f4f6",
    alignItems: "center",
    fontSize: "14px",
  },
  productName: {
    fontWeight: "500",
    color: "#333",
  },
  tableCell: {
    color: "#555",
  },
  inStock: {
    color: "#22c55e",
    fontWeight: "500",
    fontSize: "13px",
  },
  outOfStock: {
    color: "#ef4444",
    fontWeight: "500",
    fontSize: "13px",
  },
  ordersBtn: {
    backgroundColor: "white",
    color: "#6366f1",
    padding: "0.6rem 1.2rem",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
    border: "1px solid #6366f1",
  },
  setupBtn: {
    display: "inline-block",
    marginTop: "1rem",
    padding: "0.6rem 1.5rem",
    backgroundColor: "#6366f1",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default VendorDashboard;
