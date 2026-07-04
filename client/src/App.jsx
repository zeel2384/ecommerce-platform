import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import Home from "./pages/customer/Home";
import Product from "./pages/customer/Product";
import Cart from "./pages/customer/Cart";
import VendorDashboard from "./pages/vendor/Dashboard";
import AddProduct from "./pages/vendor/AddProduct";
import AdminDashboard from "./pages/admin/Dashboard";

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

        {/* Protected vendor route */}
        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute roles={["vendor"]}>
              <VendorDashboard />
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
      </Routes>
    </>
  );
};

export default App;
