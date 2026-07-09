import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import Home from "./pages/customer/Home";
import Product from "./pages/customer/Product";
import Cart from "./pages/customer/Cart";
import VendorDashboard from "./pages/vendor/Dashboard";
import VendorSetup from "./pages/vendor/Setup";
import AddProduct from "./pages/vendor/AddProduct";
import AdminDashboard from "./pages/admin/Dashboard";
import Checkout from "./pages/customer/Checkout";
import MyOrders from "./pages/customer/MyOrders";
import VendorOrders from "./pages/vendor/Orders";

// Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Protected Route component
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* home route */}
        <Route path="/" element={<Home />} />

        <Route
          path="/vendor/orders"
          element={
            <ProtectedRoute roles={["vendor"]}>
              <VendorOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute roles={["customer"]}>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute roles={["customer"]}>
              <Checkout />
            </ProtectedRoute>
          }
        />

        {/* Protected vendor route */}
        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute roles={["vendor"]}>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/setup"
          element={
            <ProtectedRoute roles={["vendor"]}>
              <VendorSetup />
            </ProtectedRoute>
          }
        />

        <Route path="/product/:id" element={<Product />} />

        <Route
          path="/vendor/add-product"
          element={
            <ProtectedRoute roles={["vendor"]}>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        {/* Protected admin route */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Cart route */}
        <Route path="/cart" element={<Cart />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
