import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";

import EmployeeDashboard from "./dashboard/EmployeeDashboard";
import ManagerDashboard from "./dashboard/ManagerDashboard";
import HRDashboard from "./dashboard/HRDashboard";

import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

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

        <Route
          path="/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeeDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/manager"
          element={
            <RoleProtectedRoute allowedRoles={["MANAGER"]}>
              <ManagerDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/hr"
          element={
            <RoleProtectedRoute allowedRoles={["HR"]}>
              <HRDashboard />
            </RoleProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
