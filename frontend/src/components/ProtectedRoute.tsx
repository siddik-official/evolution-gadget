import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole, redirectTo }) => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  console.log('ProtectedRoute check:', {
    isAuthenticated,
    user,
    userRole: user?.role,
    requiredRole,
    roleMatch: user?.role === requiredRole
  });

  if (!isAuthenticated) {
    // If admin route, redirect to admin login, otherwise regular login
    const loginPath = redirectTo || (requiredRole === UserRole.ADMIN ? '/admin/login' : '/login');
    console.log('Not authenticated, redirecting to:', loginPath);
    return <Navigate to={loginPath} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    console.log('Role mismatch! User role:', user?.role, 'Required:', requiredRole);
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('Access granted to protected route');
  return <>{children}</>;
};

export default ProtectedRoute;
