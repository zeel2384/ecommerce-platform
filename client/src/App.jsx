import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Pages (we'll create these next)
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
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Temporary home route */}
      <Route
        path="/"
        element={
          <div style={{ padding: "2rem" }}>
            <h1>🛒 Ecommerce Platform</h1>
            <p>Phase 3 in progress...</p>
          </div>
        }
      />

      {/* Protected vendor route example */}
      <Route
        path="/vendor/dashboard"
        element={
          <ProtectedRoute roles={["vendor"]}>
            <div>Vendor Dashboard Coming Soon</div>
          </ProtectedRoute>
        }
      />

      {/* Protected admin route example */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={["admin"]}>
            <div>Admin Dashboard Coming Soon</div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
