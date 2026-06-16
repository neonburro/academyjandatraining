// src/App.jsx
// Top-level route definitions. Public routes (login, signup) and protected routes
// (dashboard, courses, admin) are gated by ProtectedRoute.

import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, Spinner, Center } from '@chakra-ui/react'
import { useAuth } from './hooks/useAuth'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AppShell from './components/layout/AppShell'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import Admin from './pages/Admin'

export default function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <Center minH="100vh" bg="bg">
        <Spinner size="lg" color="brand.500" thickness="3px" />
      </Center>
    )
  }

  return (
    <Box minH="100vh" bg="bg">
      <Routes>
        <Route path="/login/" element={<Login />} />
        <Route path="/signup/" element={<Signup />} />
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard/" replace />} />
          <Route path="/dashboard/" element={<Dashboard />} />
          <Route path="/courses/" element={<Courses />} />
          <Route path="/admin/" element={<Admin />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  )
}
