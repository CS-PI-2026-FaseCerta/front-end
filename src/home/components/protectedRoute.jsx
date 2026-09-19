import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../../auth/mockAuth";

const ProtectedRoute = ({
    allowedProfiles = [],
    redirectTo = "/",
    children,
}) => {
    const currentUser = getCurrentUser();
    const currentProfile = currentUser?.perfil;

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    const hasAccess =
        allowedProfiles.length === 0 || allowedProfiles.includes(currentProfile);

    if (!hasAccess) {
        return <Navigate to={redirectTo} replace />;
    }

    return children || <Outlet />;
};

export default ProtectedRoute;