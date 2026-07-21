// src/pages/Dashboard/index.jsx
// The salesperson's daily itinerary. Time-aware greeting, today's plan,
// momentum (streak + course progress), up-next, and the AI coach placeholder.
// Admins additionally see a preview note + a path to set up the academy.
//
// Reads the current user via useAuth (profile.first_name, initials, role,
// isAdmin). Itinerary content is placeholder (see ./data.js) until courses and
// progress land in Supabase, at which point only the data source changes.

import { VStack } from '@chakra-ui/react'
import { useAuth } from '../../hooks/useAuth'
import GreetingHeader from './components/GreetingHeader.jsx'
import TodaysPlan from './components/TodaysPlan.jsx'
import MomentumRow from './components/MomentumRow.jsx'
import UpNext from './components/UpNext.jsx'
import CoachCard from './components/CoachCard.jsx'
import AdminNudge from './components/AdminNudge.jsx'
import { TODAYS_PLAN, CURRENT_COURSE, UP_NEXT, STREAK_DAYS } from './data.js'

const ROLE_LABELS = {
  admin: 'Admin',
  manager: 'Manager',
  salesperson: 'Salesperson',
}

export default function Dashboard() {
  const { user, profile, isAdmin } = useAuth()

  const firstName = profile?.first_name || profile?.display_name || user?.email?.split('@')[0] || 'there'
  const initials = profile?.initials || (firstName ? firstName[0].toUpperCase() : 'T')
  const roleLabel = ROLE_LABELS[profile?.role] || (profile?.role ? profile.role : null)

  return (
    <VStack align="stretch" spacing={8} maxW="920px">
      <GreetingHeader
        firstName={firstName}
        initials={initials}
        role={roleLabel}
        planCount={TODAYS_PLAN.length}
        minutes={15}
      />

      <TodaysPlan items={TODAYS_PLAN} />

      <MomentumRow streakDays={STREAK_DAYS} course={CURRENT_COURSE} />

      <UpNext items={UP_NEXT} />

      <CoachCard firstName={firstName} />

      {isAdmin && <AdminNudge />}
    </VStack>
  )
}