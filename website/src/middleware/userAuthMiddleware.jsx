import { Navigate, Outlet } from "react-router";

export default function UserProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children || <Outlet />;
};

