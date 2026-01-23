import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: ('user' | 'farmer' | 'admin')[];
    redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
    redirectTo = '/'
}) => {
    const { user, isLoading, isAuthenticated } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-stone-900"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to appropriate login page
        if (allowedRoles.includes('farmer')) {
            return <Navigate to="/farmer/login" state={{ from: location }} replace />;
        }
        if (allowedRoles.includes('admin')) {
            return <Navigate to="/admin/login" state={{ from: location }} replace />;
        }
        return <Navigate to={redirectTo} replace />;
    }

    if (!allowedRoles.includes(user!.role)) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};
