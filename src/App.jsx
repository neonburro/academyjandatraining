// src/App.jsx
// Top-level routes. Public: /login/, /signup/, /reset-password/.
// Protected: /dashboard/, /calendar/, /team/, /courses/, /insights/.

import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, Spinner, Center } from '@chakra-ui/react'
import { useAuth } from './hooks/useAuth'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AppShell from './components/layout/AppShell'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import CalendarPage from './pages/Calendar'
import Team from './pages/Team'
import Courses from './pages/Courses'
import Insights from './pages/Insights'

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
        <Route path="/reset-password/" element={<ResetPassword />} />
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard/" replace />} />
          <Route path="/dashboard/" element={<Dashboard />} />
          <Route path="/calendar/" element={<CalendarPage />} />
          <Route path="/team/" element={<Team />} />
          <Route path="/courses/" element={<Courses />} />
          <Route path="/insights/" element={<Insights />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  )
}
