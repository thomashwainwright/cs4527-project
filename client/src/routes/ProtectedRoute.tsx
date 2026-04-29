import { useAuth } from "@/auth/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowed }: { allowed: string[] }) {
  const { isLoading, isAuthenticated, role } = useAuth();
  console.log(role);
  if (isLoading) {
    return <></>;
  }

  if (!isAuthenticated || !role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed.includes(role)) {
    return (
      <div className="m-auto text-6xl flex flex-col items-center gap-4">
        Access to this page is denied.
      </div>
    );
  }

  return <Outlet />;
}
