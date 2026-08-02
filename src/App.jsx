// src/App.jsx
// STATUS: active | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Header standardized; Phase 1 checkpoint committed (e765830).
//   2026-08-01  Nav trio routes: /coach/ added; roadmap routes /courses/roadmap/ and :slug/
// NEXT: Admin route + /team/ manager view land in Phase 2
// Top-level routes. Public: /login/, /signup/, /reset-password/.
// Protected: /dashboard/, /courses/ (Training hub), /courses/roadmap/ and
// /courses/roadmap/:slug/ (the 13-step path), /coach/, /calendar/, /team/,
// /settings/.

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
import Roadmap from './pages/Roadmap'
import StepDetail from './pages/Roadmap/StepDetail'
import Coach from './pages/Coach'
import Settings from './pages/Settings'

export default function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <Center minH="100vh" bg="bg">
        <Spinner size="lg" color="ink" thickness="3px" />
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
          <Route path="/courses/" element={<Courses />} />
          <Route path="/courses/roadmap/" element={<Roadmap />} />
          <Route path="/courses/roadmap/:slug/" element={<StepDetail />} />
          <Route path="/coach/" element={<Coach />} />
          <Route path="/calendar/" element={<CalendarPage />} />
          <Route path="/team/" element={<Team />} />
          <Route path="/settings/" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  )
}