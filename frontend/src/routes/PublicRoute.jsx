import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // Not logged in → allow login/register
  if (!token || !user) {
    return children;
  }

  const parsedUser = JSON.parse(user);

  // Logged in → redirect by role
  if (parsedUser.role === "EMPLOYEE") {
    return <Navigate to="/dashboard" replace />;
  }

  if (parsedUser.role === "MANAGER") {
    return <Navigate to="/manager" replace />;
  }

  if (parsedUser.role === "HR") {
    return <Navigate to="/hr" replace />;
  }

  return children;
};

export default PublicRoute;
