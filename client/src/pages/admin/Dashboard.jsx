import { useState, useEffect } from "react";
import { getAllVendors, approveVendor } from "../../api";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const { data } = await getAllVendors();
      setVendors(data.vendors);
    } catch (error) {
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (vendorId, approve) => {
    try {
      await approveVendor(vendorId, { isApproved: approve });
      toast.success(
        `Vendor ${approve ? "approved" : "rejected"} successfully!`,
      );
      fetchVendors();
    } catch (error) {
      toast.error("Failed to update vendor status");
    }
  };

  const filteredVendors = vendors.filter((v) => {
    if (activeTab === "pending") return !v.isApproved;
    if (activeTab === "approved") return v.isApproved;
    return true;
  });

  const stats = {
    total: vendors.length,
    approved: vendors.filter((v) => v.isApproved).length,
    pending: vendors.filter((v) => !v.isApproved).length,
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <p>Loading dashboard... ⏳</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard 👑</h1>
        <p style={styles.subtitle}>Manage vendors and platform settings</p>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, borderLeft: "4px solid #6366f1" }}>
          <p style={styles.statLabel}>Total Vendors</p>
          <p style={styles.statValue}>{stats.total}</p>
          <p style={styles.statIcon}>🏪</p>
        </div>
        <div style={{ ...styles.statCard, borderLeft: "4px solid #22c55e" }}>
          <p style={styles.statLabel}>Approved Vendors</p>
          <p style={styles.statValue}>{stats.approved}</p>
          <p style={styles.statIcon}>✅</p>
        </div>
        <div style={{ ...styles.statCard, borderLeft: "4px solid #f59e0b" }}>
          <p style={styles.statLabel}>Pending Approval</p>
          <p style={styles.statValue}>{stats.pending}</p>
          <p style={styles.statIcon}>⏳</p>
        </div>
        <div style={{ ...styles.statCard, borderLeft: "4px solid #ef4444" }}>
          <p style={styles.statLabel}>Platform Status</p>
          <p style={styles.statValue}>🟢 Live</p>
          <p style={styles.statIcon}>🚀</p>
        </div>
      </div>

      {/* Vendors Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Vendor Management</h2>

          {/* Tabs */}
          <div style={styles.tabs}>
            {["all", "pending", "approved"].map((tab) => (
              <button
                key={tab}
                style={activeTab === tab ? styles.tabActive : styles.tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === "pending" && stats.pending > 0 && (
                  <span style={styles.badge}>{stats.pending}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Vendors Table */}
        {filteredVendors.length === 0 ? (
          <div style={styles.empty}>
            <p>No vendors found</p>
          </div>
        ) : (
          <div style={styles.table}>
            {/* Table Header */}
            <div style={styles.tableHeader}>
              <span>Shop Name</span>
              <span>Owner</span>
              <span>Email</span>
              <span>Products</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {/* Table Rows */}
            {filteredVendors.map((vendor) => (
              <div key={vendor._id} style={styles.tableRow}>
                <span style={styles.shopName}>🏪 {vendor.shopName}</span>
                <span style={styles.tableCell}>{vendor.user?.name}</span>
                <span style={styles.tableCell}>{vendor.user?.email}</span>
                <span style={styles.tableCell}>{vendor.totalProducts}</span>
                <span
                  style={vendor.isApproved ? styles.approved : styles.pending}
                >
                  {vendor.isApproved ? "✅ Approved" : "⏳ Pending"}
                </span>
                <div style={styles.actions}>
                  {!vendor.isApproved ? (
                    <button
                      style={styles.approveBtn}
                      onClick={() => handleApprove(vendor._id, true)}
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      style={styles.rejectBtn}
                      onClick={() => handleApprove(vendor._id, false)}
                    >
                      Revoke
                    </button>
                  )}
                </div>
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
  header: {
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
    flexWrap: "wrap",
    gap: "1rem",
  },
  sectionTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#333",
  },
  tabs: {
    display: "flex",
    gap: "8px",
  },
  tab: {
    padding: "6px 16px",
    borderRadius: "25px",
    border: "1px solid #e5e7eb",
    backgroundColor: "white",
    cursor: "pointer",
    fontSize: "13px",
    color: "#666",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  tabActive: {
    padding: "6px 16px",
    borderRadius: "25px",
    border: "1px solid #6366f1",
    backgroundColor: "#6366f1",
    cursor: "pointer",
    fontSize: "13px",
    color: "white",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  badge: {
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
  table: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 2fr 1fr 1fr 1fr",
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
    gridTemplateColumns: "2fr 1fr 2fr 1fr 1fr 1fr",
    padding: "0.75rem 1rem",
    borderBottom: "1px solid #f3f4f6",
    alignItems: "center",
    fontSize: "14px",
  },
  shopName: {
    fontWeight: "500",
    color: "#333",
  },
  tableCell: {
    color: "#555",
  },
  approved: {
    color: "#22c55e",
    fontWeight: "500",
    fontSize: "13px",
  },
  pending: {
    color: "#f59e0b",
    fontWeight: "500",
    fontSize: "13px",
  },
  actions: {
    display: "flex",
    gap: "8px",
  },
  approveBtn: {
    padding: "4px 12px",
    backgroundColor: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
  },
  rejectBtn: {
    padding: "4px 12px",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
  },
  empty: {
    textAlign: "center",
    padding: "2rem",
    color: "#666",
  },
};

export default AdminDashboard;
