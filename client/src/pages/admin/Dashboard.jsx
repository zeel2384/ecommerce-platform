import { useState, useEffect, useCallback } from "react";
import { getAllVendors, approveVendor } from "../../api";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getAllVendors();
      setVendors(data.vendors);
    } catch {
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const handleApprove = async (vendorId, approve) => {
    try {
      await approveVendor(vendorId, { isApproved: approve });
      toast.success(
        `Vendor ${approve ? "approved" : "rejected"} successfully!`,
      );
      fetchVendors();
    } catch {
      toast.error("Failed to update vendor status");
    }
  };

  const filteredVendors = vendors.filter((v) => {
    if (activeTab === "pending") return !v.isApproved;
    if (activeTab === "approved") return v.isApproved;
    return true;
  });

  const stats = [
    {
      label: "Total Vendors",
      value: vendors.length,
      icon: "🏪",
      color: "#6366f1",
    },
    {
      label: "Approved",
      value: vendors.filter((v) => v.isApproved).length,
      icon: "✅",
      color: "#22c55e",
    },
    {
      label: "Pending",
      value: vendors.filter((v) => !v.isApproved).length,
      icon: "⏳",
      color: "#f59e0b",
    },
    { label: "Platform", value: "🟢 Live", icon: "🚀", color: "#3b82f6" },
  ];

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "5rem",
          color: "var(--text-secondary)",
          backgroundColor: "var(--bg)",
          minHeight: "100vh",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "var(--bg)",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: "800",
              color: "var(--text)",
              marginBottom: "0.5rem",
            }}
          >
            Admin Dashboard 👑
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
            Manage vendors and platform settings
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                backgroundColor: "var(--surface)",
                borderRadius: "16px",
                padding: "1.5rem",
                boxShadow: "var(--shadow)",
                border: "1px solid var(--border)",
                borderLeft: `4px solid ${stat.color}`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  marginBottom: "0.75rem",
                  fontWeight: "600",
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "800",
                  color: "var(--text)",
                }}
              >
                {stat.value}
              </p>
              <span
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  fontSize: "2rem",
                  opacity: 0.2,
                }}
              >
                {stat.icon}
              </span>
            </div>
          ))}
        </div>

        {/* Vendors Section */}
        <div
          style={{
            backgroundColor: "var(--surface)",
            borderRadius: "16px",
            padding: "1.5rem",
            boxShadow: "var(--shadow)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.2rem",
                fontWeight: "800",
                color: "var(--text)",
              }}
            >
              Vendor Management
            </h2>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "8px" }}>
              {["all", "pending", "approved"].map((tab) => (
                <button
                  key={tab}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "25px",
                    border:
                      activeTab === tab
                        ? "2px solid #6366f1"
                        : "2px solid var(--border)",
                    backgroundColor:
                      activeTab === tab ? "#6366f1" : "var(--surface2)",
                    color:
                      activeTab === tab ? "white" : "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === "pending" &&
                    vendors.filter((v) => !v.isApproved).length > 0 && (
                      <span
                        style={{
                          backgroundColor: "#ef4444",
                          color: "white",
                          borderRadius: "50%",
                          width: "18px",
                          height: "18px",
                          fontSize: "11px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "800",
                        }}
                      >
                        {vendors.filter((v) => !v.isApproved).length}
                      </span>
                    )}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {filteredVendors.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "var(--text-secondary)",
              }}
            >
              <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏪</p>
              <p>No vendors found</p>
            </div>
          ) : (
            <div>
              {/* Table Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 2fr 1fr 1fr 1fr",
                  padding: "0.75rem 1rem",
                  backgroundColor: "var(--surface2)",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "var(--text-secondary)",
                  marginBottom: "0.5rem",
                  border: "1px solid var(--border)",
                }}
              >
                <span>Shop Name</span>
                <span>Owner</span>
                <span>Email</span>
                <span>Products</span>
                <span>Status</span>
                <span>Action</span>
              </div>

              {/* Table Rows */}
              {filteredVendors.map((vendor, index) => (
                <div
                  key={vendor._id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 2fr 1fr 1fr 1fr",
                    padding: "0.75rem 1rem",
                    borderBottom:
                      index < filteredVendors.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                    alignItems: "center",
                    fontSize: "14px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--surface2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <span
                    style={{
                      fontWeight: "700",
                      color: "var(--text)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    🏪 {vendor.shopName}
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    {vendor.user?.name}
                  </span>
                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "13px",
                    }}
                  >
                    {vendor.user?.email}
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    {vendor.totalProducts}
                  </span>
                  <span
                    style={{
                      color: vendor.isApproved ? "#22c55e" : "#f59e0b",
                      fontWeight: "700",
                      fontSize: "13px",
                    }}
                  >
                    {vendor.isApproved ? "✅ Approved" : "⏳ Pending"}
                  </span>
                  <div>
                    {!vendor.isApproved ? (
                      <button
                        style={{
                          padding: "5px 14px",
                          backgroundColor: "#22c55e",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: "700",
                        }}
                        onClick={() => handleApprove(vendor._id, true)}
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        style={{
                          padding: "5px 14px",
                          backgroundColor: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: "700",
                        }}
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
    </div>
  );
};

export default AdminDashboard;
