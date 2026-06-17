import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { ReactNode } from 'react';

interface Props {
  children:      ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, isAuth } = useAuth();

  if (!isAuth) return <Navigate to="/login" replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role))
    return <Navigate to="/" replace />;

  return <>{children}</>;
}