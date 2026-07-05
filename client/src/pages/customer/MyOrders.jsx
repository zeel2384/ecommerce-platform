import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../../api";
import toast from "react-hot-toast";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await getMyOrders();
      setOrders(data.orders);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div style={styles.loading}>
        <p>Loading orders... ⏳</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Orders 📦</h1>
      <p style={styles.subtitle}>
        {orders.length} order{orders.length !== 1 ? "s" : ""} placed
      </p>

      {orders.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyIcon}>📦</p>
          <h2 style={styles.emptyTitle}>No orders yet!</h2>
          <p style={styles.emptySubtitle}>
            Start shopping to see your orders here
          </p>
          <Link to="/" style={styles.shopBtn}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={styles.ordersList}>
          {orders.map((order) => (
            <div key={order._id} style={styles.orderCard}>
              {/* Order Header */}
              <div style={styles.orderHeader}>
                <div>
                  <p style={styles.orderId}>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p style={styles.orderDate}>
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div style={styles.orderRight}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(order.orderStatus) + "20",
                      color: getStatusColor(order.orderStatus),
                    }}
                  >
                    {order.orderStatus}
                  </span>
                  <p style={styles.orderTotal}>
                    ₹{order.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div style={styles.orderItems}>
                {order.items.map((item, index) => (
                  <div key={index} style={styles.orderItem}>
                    <div style={styles.itemImage}>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={styles.image}
                        />
                      ) : (
                        <div style={styles.noImage}>📦</div>
                      )}
                    </div>
                    <div style={styles.itemInfo}>
                      <p style={styles.itemName}>{item.name}</p>
                      <p style={styles.itemDetails}>
                        Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                    <p style={styles.itemTotal}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              <div style={styles.deliveryInfo}>
                <p style={styles.deliveryTitle}>📍 Delivering to:</p>
                <p style={styles.deliveryAddress}>
                  {order.deliveryAddress.fullName},{" "}
                  {order.deliveryAddress.street}, {order.deliveryAddress.city},{" "}
                  {order.deliveryAddress.state} -{" "}
                  {order.deliveryAddress.pincode}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "2rem",
  },
  loading: {
    textAlign: "center",
    padding: "3rem",
    color: "#666",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#666",
    marginBottom: "2rem",
  },
  empty: {
    textAlign: "center",
    padding: "4rem 2rem",
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "1rem",
  },
  emptyTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "0.5rem",
  },
  emptySubtitle: {
    color: "#666",
    marginBottom: "1.5rem",
  },
  shopBtn: {
    display: "inline-block",
    padding: "0.75rem 2rem",
    backgroundColor: "#6366f1",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
  },
  ordersList: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #f3f4f6",
  },
  orderId: {
    fontWeight: "bold",
    color: "#333",
    fontSize: "1rem",
    marginBottom: "4px",
  },
  orderDate: {
    color: "#666",
    fontSize: "13px",
  },
  orderRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px",
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },
  orderTotal: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#333",
  },
  orderItems: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginBottom: "1rem",
  },
  orderItem: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  itemImage: {
    width: "60px",
    height: "60px",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    flexShrink: 0,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  noImage: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: "500",
    color: "#333",
    marginBottom: "4px",
  },
  itemDetails: {
    fontSize: "13px",
    color: "#666",
  },
  itemTotal: {
    fontWeight: "600",
    color: "#333",
  },
  deliveryInfo: {
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    padding: "0.75rem",
    marginTop: "1rem",
  },
  deliveryTitle: {
    fontWeight: "600",
    color: "#333",
    fontSize: "13px",
    marginBottom: "4px",
  },
  deliveryAddress: {
    color: "#666",
    fontSize: "13px",
    lineHeight: "1.5",
  },
};

export default MyOrders;
