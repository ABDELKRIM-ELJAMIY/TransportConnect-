// Utility functions for role-based navigation

/**
 * Get the dashboard route based on user role
 * @param {string} role - User role
 * @returns {string} Dashboard route
 */
export const getDashboardRoute = (role) => {
    switch (role) {
        case 'admin':
            return '/admin/dashboard';
        case 'conducteur':
            return '/conducteur/dashboard';
        case 'expediteur':
            return '/expediteur/dashboard';
        default:
            return '/conducteur/dashboard'; // Default fallback
    }
};

/**
 * Check if user has access to a specific route
 * @param {string} userRole - Current user role
 * @param {string} requiredRole - Required role for the route
 * @returns {boolean} Whether user has access
 */
export const hasRouteAccess = (userRole, requiredRole) => {
    if (!userRole || !requiredRole) return false;

    // Admin has access to everything
    if (userRole === 'admin') return true;

    // Check if roles match
    return userRole === requiredRole;
};

/**
 * Get user role from localStorage
 * @returns {string|null} User role or null if not found
 */
export const getUserRole = () => {
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            return userData.role;
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    }
    return null;
};

/**
 * Redirect user to appropriate dashboard based on their role
 * @param {Function} navigate - React Router navigate function
 * @param {string} role - User role (optional, will get from localStorage if not provided)
 */
export const redirectToDashboard = (navigate, role = null) => {
    const userRole = role || getUserRole();
    const dashboardRoute = getDashboardRoute(userRole);
    navigate(dashboardRoute);
};

/**
 * Check if current route is accessible for user role
 * @param {string} currentPath - Current route path
 * @param {string} userRole - User role
 * @returns {boolean} Whether route is accessible
 */
export const isRouteAccessible = (currentPath, userRole) => {
    // Public routes that everyone can access
    const publicRoutes = ['/', '/login', '/register'];
    if (publicRoutes.includes(currentPath)) return true;

    // Role-specific route patterns
    const routePatterns = {
        admin: '/admin',
        conducteur: '/conducteur',
        expediteur: '/expediteur'
    };

    // Check if route matches user's role pattern
    const userRoutePattern = routePatterns[userRole];
    if (userRoutePattern && currentPath.startsWith(userRoutePattern)) {
        return true;
    }

    return false;
}; 