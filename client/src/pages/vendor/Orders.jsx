import { useState, useEffect, useCallback } from "react";
import { getVendorOrders, updateOrderStatus } from "../../api";
import useViewport from "../../hooks/useViewport";
import toast from "react-hot-toast";

const VendorOrders = () => {
  const { isMobile } = useViewport();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getVendorOrders();
      setOrders(data.orders);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, { orderStatus: status });
      toast.success(`Order status updated to ${status}! ✅`);
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "#f59e0b";
      case "Confirmed":
        return "#6366f1";
      case "Shipped":
        return "#3b82f6";
      case "Delivered":
        return "#22c55e";
      case "Cancelled":
        return "#ef4444";
      default:
        return "#666";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return "⏳";
      case "Confirmed":
        return "✅";
      case "Shipped":
        return "🚚";
      case "Delivered":
        return "📦";
      case "Cancelled":
        return "❌";
      default:
        return "📋";
    }
  };

  const getNextStatus = (status) => {
    switch (status) {
      case "Processing":
        return "Confirmed";
      case "Confirmed":
        return "Shipped";
      case "Shipped":
        return "Delivered";
      default:
        return null;
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
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "var(--bg)",
        minHeight: "100vh",
        padding: isMobile ? "1rem" : "2rem",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "800",
            color: "var(--text)",
            marginBottom: "0.5rem",
          }}
        >
          Manage Orders 📦
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "2rem",
            fontSize: "15px",
          }}
        >
          {orders.length} order{orders.length !== 1 ? "s" : ""} received
        </p>

        {orders.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 2rem",
              backgroundColor: "var(--surface)",
              borderRadius: "16px",
              border: "1px solid var(--border)",
            }}
          >
            <p style={{ fontSize: "4rem", marginBottom: "1rem" }}>📦</p>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "800",
                color: "var(--text)",
                marginBottom: "0.5rem",
              }}
            >
              No orders yet!
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Orders will appear here when customers buy your products
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {orders.map((order) => (
              <div
                key={order._id}
                style={{
                  backgroundColor: "var(--surface)",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  boxShadow: "var(--shadow)",
                  border: "1px solid var(--border)",
                }}
              >
                {/* Order Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "stretch" : "flex-start",
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? "0.75rem" : "0",
                    marginBottom: "1.25rem",
                    paddingBottom: "1.25rem",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontWeight: "800",
                        color: "var(--text)",
                        fontSize: "1rem",
                        marginBottom: "4px",
                      }}
                    >
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "13px",
                        marginBottom: "4px",
                      }}
                    >
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p
                      style={{
                        color: "#6366f1",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      👤 {order.customer?.name} — {order.customer?.email}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isMobile ? "flex-start" : "flex-end",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        padding: "5px 14px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: "700",
                        backgroundColor:
                          getStatusColor(order.orderStatus) + "20",
                        color: getStatusColor(order.orderStatus),
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {getStatusIcon(order.orderStatus)} {order.orderStatus}
                    </span>
                    <p
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "800",
                        color: "var(--text)",
                      }}
                    >
                      ₹{order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                  }}
                >
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: isMobile ? "flex-start" : "center",
                        flexDirection: isMobile ? "column" : "row",
                        gap: "1rem",
                        padding: "0.75rem",
                        backgroundColor: "var(--surface2)",
                        borderRadius: "10px",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div
                        style={{
                          width: "55px",
                          height: "55px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          backgroundColor: "var(--surface)",
                          border: "1px solid var(--border)",
                          flexShrink: 0,
                        }}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.5rem",
                            }}
                          >
                            📦
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontWeight: "700",
                            color: "var(--text)",
                            marginBottom: "4px",
                          }}
                        >
                          {item.name}
                        </p>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "var(--text-muted)",
                          }}
                        >
                          Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                      <p
                        style={{
                          fontWeight: "800",
                          color: "var(--text)",
                          fontSize: "15px",
                        }}
                      >
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Delivery Address */}
                <div
                  style={{
                    backgroundColor: "var(--surface2)",
                    borderRadius: "10px",
                    padding: "0.75rem 1rem",
                    marginBottom: "1rem",
                    border: "1px solid var(--border)",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "700",
                      color: "var(--text)",
                      fontSize: "13px",
                      marginBottom: "4px",
                    }}
                  >
                    📍 Deliver to:
                  </p>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "13px",
                      lineHeight: "1.5",
                      marginBottom: "2px",
                    }}
                  >
                    {order.deliveryAddress.fullName},{" "}
                    {order.deliveryAddress.street}, {order.deliveryAddress.city}
                    , {order.deliveryAddress.state} -{" "}
                    {order.deliveryAddress.pincode}
                  </p>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "13px",
                    }}
                  >
                    📞 {order.deliveryAddress.phone}
                  </p>
                </div>

                {/* Status Update */}
                {getNextStatus(order.orderStatus) && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: isMobile ? "stretch" : "center",
                      justifyContent: "space-between",
                      flexDirection: isMobile ? "column" : "row",
                      gap: isMobile ? "0.75rem" : "0",
                      paddingTop: "1rem",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "14px",
                      }}
                    >
                      Update order status:
                    </p>
                    <button
                      style={{
                        padding: "8px 20px",
                        backgroundColor: "#6366f1",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                      onClick={() =>
                        handleStatusUpdate(
                          order._id,
                          getNextStatus(order.orderStatus),
                        )
                      }
                    >
                      Mark as {getNextStatus(order.orderStatus)} →
                    </button>
                  </div>
                )}

                {order.orderStatus === "Delivered" && (
                  <div
                    style={{
                      backgroundColor: "#f0fdf4",
                      border: "1px solid #86efac",
                      color: "#166534",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      fontSize: "14px",
                      textAlign: "center",
                      marginTop: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    ✅ Order Delivered Successfully!
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorOrders;
