import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { PERFIL_USUARIO } from "../../auth/mockAuth";

const ProtectedRoute = ({
  allowedProfiles = [],
  redirectTo = "/",
  children,
}) => {
  const hasAccess =
    allowedProfiles.length === 0 || allowedProfiles.includes(PERFIL_USUARIO);

  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
