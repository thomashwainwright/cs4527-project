import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ auth }: { auth: boolean }) {
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
