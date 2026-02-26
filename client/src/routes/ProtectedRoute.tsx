import { useAuth } from "@/auth/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <></>;
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
