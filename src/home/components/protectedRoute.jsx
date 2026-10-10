import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getCurrentUser } from "../../auth/session";

const ProtectedRoute = ({ allowedProfiles = [], redirectTo = "/dashboard", children }) => {
  const location = useLocation();
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (allowedProfiles.length > 0 && !allowedProfiles.some((p) => p.toLowerCase() === user.perfil)) {
    return <Navigate to={redirectTo} replace />;
  }
  return children || <Outlet />;
};

export default ProtectedRoute;
