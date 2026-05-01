// Component protects routes based on authentication status and user role.

import { useAuth } from "@/auth/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowed }: { allowed: string[] }) {
  // get auth state and user role from context.
  const { isLoading, isAuthenticated, role } = useAuth();

  // while auth state is loading, render nothing.
  if (isLoading) {
    return <></>;
  }

  // if not authenticated or role missing, redirect to login page.
  if (!isAuthenticated || !role) {
    return <Navigate to="/login" replace />;
  }

  // if user role is not allowed, show access denied message.
  if (!allowed.includes(role)) {
    return (
      <div className="m-auto text-6xl flex flex-col items-center gap-4">
        Access to this page is denied.
      </div>
    );
  }

  // if authenticated and authorised, render nested route.
  return <Outlet />;
}
