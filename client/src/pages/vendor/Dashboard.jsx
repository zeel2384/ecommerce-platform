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

  if (!vendor) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "5rem 2rem",
          backgroundColor: "var(--bg)",
          minHeight: "100vh",
        }}
      >
        <h2 style={{ color: "var(--text)", marginBottom: "1rem" }}>
          You don't have a shop yet!
        </h2>
        <Link
          to="/vendor/setup"
          style={{
            display: "inline-block",
            padding: "0.75rem 2rem",
            backgroundColor: "#6366f1",
            color: "white",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "700",
          }}
        >
          Setup Shop
        </Link>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Products",
      value: vendor.totalProducts,
      icon: "📦",
      color: "#6366f1",
    },
    {
      label: "Total Orders",
      value: vendor.totalOrders,
      icon: "🛒",
      color: "#22c55e",
    },
    {
      label: "Total Revenue",
      value: `₹${vendor.totalRevenue.toLocaleString()}`,
      icon: "💰",
      color: "#f59e0b",
    },
    {
      label: "Shop Status",
      value: vendor.isApproved ? "✅ Active" : "⏳ Pending",
      icon: "🏪",
      color: "#3b82f6",
    },
  ];

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "1.8rem",
                fontWeight: "800",
                color: "var(--text)",
                marginBottom: "0.5rem",
              }}
            >
              Welcome back, {user?.name?.split(" ")[0]}! 👋
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "15px",
                }}
              >
                🏪 {vendor.shopName}
              </span>
              {!vendor.isApproved && (
                <span
                  style={{
                    backgroundColor: "#fef3c7",
                    color: "#d97706",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  ⏳ Pending Approval
                </span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link
              to="/vendor/orders"
              style={{
                backgroundColor: "var(--surface)",
                color: "#6366f1",
                padding: "0.6rem 1.2rem",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "700",
                fontSize: "14px",
                border: "2px solid #6366f1",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              📦 View Orders
            </Link>
            <Link
              to="/vendor/add-product"
              style={{
                backgroundColor: "#6366f1",
                color: "white",
                padding: "0.6rem 1.2rem",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "700",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              + Add Product
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
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

        {/* Products Table */}
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
            }}
          >
            <h2
              style={{
                fontSize: "1.2rem",
                fontWeight: "800",
                color: "var(--text)",
              }}
            >
              Your Products
            </h2>
            <Link
              to="/vendor/add-product"
              style={{
                backgroundColor: "#6366f1",
                color: "white",
                padding: "0.4rem 1rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "700",
                fontSize: "13px",
              }}
            >
              + Add New
            </Link>
          </div>

          {products.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "var(--text-secondary)",
              }}
            >
              <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</p>
              <p style={{ marginBottom: "1rem" }}>No products yet!</p>
              <Link
                to="/vendor/add-product"
                style={{
                  display: "inline-block",
                  padding: "0.6rem 1.5rem",
                  backgroundColor: "#6366f1",
                  color: "white",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "700",
                }}
              >
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div>
              {/* Table Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
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
                <span>Product</span>
                <span>Category</span>
                <span>Price</span>
                <span>Stock</span>
                <span>Status</span>
              </div>

              {/* Table Rows */}
              {products.map((product, index) => (
                <div
                  key={product._id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                    padding: "0.75rem 1rem",
                    borderBottom:
                      index < products.length - 1
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          border: "1px solid var(--border)",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          backgroundColor: "var(--surface2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.2rem",
                          border: "1px solid var(--border)",
                        }}
                      >
                        📦
                      </div>
                    )}
                    <span
                      style={{
                        fontWeight: "700",
                        color: "var(--text)",
                      }}
                    >
                      {product.name}
                    </span>
                  </div>
                  <span style={{ color: "var(--text-secondary)" }}>
                    {product.category}
                  </span>
                  <span style={{ color: "var(--text)", fontWeight: "600" }}>
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    {product.stock}
                  </span>
                  <span
                    style={{
                      color: product.stock > 0 ? "#22c55e" : "#ef4444",
                      fontWeight: "700",
                      fontSize: "13px",
                    }}
                  >
                    {product.stock > 0 ? "✅ In Stock" : "❌ Out of Stock"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
