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
import VerifyOTP from "./pages/auth/VerifyOTP";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyForgotOTP from "./pages/auth/VerifyForgotOTP";
import ResetPassword from "./pages/auth/ResetPassword";

// Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

const getDefaultPathForRole = (role) => {
  if (role === "admin") return "/admin/dashboard";
  if (role === "vendor") return "/vendor/dashboard";
  return "/";
};

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

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={getDefaultPathForRole(user?.role)} replace />;
  }

  return children;
};

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* OTP and Password routes */}
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-forgot-otp" element={<VerifyForgotOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

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
        <Route
          path="/cart"
          element={
            <ProtectedRoute roles={["customer", "vendor", "admin"]}>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
