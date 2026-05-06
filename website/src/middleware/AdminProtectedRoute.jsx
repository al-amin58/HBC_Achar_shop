import { Navigate, Outlet } from 'react-router';

/**
 * Dashboard routes এর জন্য — token না থাকলে /admin/login এ পাঠাবে
 */
export default function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children || <Outlet />;
}