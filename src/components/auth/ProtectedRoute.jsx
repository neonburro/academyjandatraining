// src/components/auth/ProtectedRoute.jsx
// Route guard. Redirects to /login/ if the user is not authenticated.
// Renders children (or nested route via Outlet) if authenticated.

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  if (!isAuthenticated) {
    return <Navigate to="/login/" state={{ from: location }} replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard/" replace />
  }

  return children || <Outlet />
}
