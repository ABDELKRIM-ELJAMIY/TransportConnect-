import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getUserRole, isRouteAccessible } from '../utils/roleNavigation';

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const userRole = getUserRole();

    // Check if user is authenticated
    if (!token) {
        // Redirect to login with return url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If no specific role is required, just check authentication
    if (!requiredRole) {
        return children;
    }

    // Check if user has the required role
    if (userRole !== requiredRole && userRole !== 'admin') {
        // Redirect to appropriate dashboard based on user's role
        const dashboardRoute = userRole === 'conducteur' ? '/conducteur/dashboard' :
            userRole === 'expediteur' ? '/expediteur/dashboard' :
                userRole === 'admin' ? '/admin/dashboard' : '/login';

        return <Navigate to={dashboardRoute} replace />;
    }

    // Check if route is accessible for user's role
    if (!isRouteAccessible(location.pathname, userRole)) {
        // Redirect to appropriate dashboard
        const dashboardRoute = userRole === 'conducteur' ? '/conducteur/dashboard' :
            userRole === 'expediteur' ? '/expediteur/dashboard' :
                userRole === 'admin' ? '/admin/dashboard' : '/login';

        return <Navigate to={dashboardRoute} replace />;
    }

    return children;
};

export default ProtectedRoute; 