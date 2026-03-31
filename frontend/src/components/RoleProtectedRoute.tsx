import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser, isAuthenticated } from '../utils/auth';
import type { UserRole } from '../types/user';

type RoleProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: UserRole[];
};

export default function RoleProtectedRoute({
  children,
  allowedRoles,
}: RoleProtectedRouteProps): React.JSX.Element {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUser();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
