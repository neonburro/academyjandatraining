// src/components/auth/ProtectedRoute.jsx
// STATUS: stable | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Header standardized; Phase 1 checkpoint committed (e765830).
// NEXT: Role-aware route guards (manager/admin) in Phase 2
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
