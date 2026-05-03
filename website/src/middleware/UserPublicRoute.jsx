import { Navigate, Outlet } from "react-router";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/customer" />; 
  }

  return children || <Outlet />;
}