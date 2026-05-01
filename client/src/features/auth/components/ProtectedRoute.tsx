import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../app/routes/paths';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  
  // Mock auth state - Replace with real auth logic (e.g., from a context or store)
  const user = {
    isAuthenticated: true, // Change to false to test redirection
    role: 'ADMIN', // Example roles: 'ADMIN', 'STUDENT', 'INTERVIEWER'
  };

  if (!user.isAuthenticated) {
    // Redirect to login but save the location they were trying to go to
    return <Navigate to={ROUTES.PUBLIC.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user is logged in but doesn't have the right role, redirect to their default dashboard
    return <Navigate to={ROUTES.APP.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
