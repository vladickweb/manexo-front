import { Navigate, useLocation } from "react-router-dom";

import { Loader } from "@/components/Loader/Loader";
import { useAuth } from "@/hooks/useAuth";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/search" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
