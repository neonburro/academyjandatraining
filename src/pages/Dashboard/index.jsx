// src/pages/Dashboard/index.jsx
// STATUS: active | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Header standardized; Phase 1 checkpoint committed (e765830).
//   2026-08-01  Itinerary derived from real Roadmap position via buildItinerary
// The daily itinerary. Time-aware greeting, today's plan, momentum
// (streak + Roadmap progress), up-next and the live coach card. Everything is
// derived from the user's real position on the 13-step Roadmap via
// buildItinerary; admins additionally see the setup nudge.

import { useMemo } from 'react'
import { VStack } from '@chakra-ui/react'
import { useAuth } from '../../hooks/useAuth'
import GreetingHeader from './components/GreetingHeader.jsx'
import TodaysPlan from './components/TodaysPlan.jsx'
import MomentumRow from './components/MomentumRow.jsx'
import UpNext from './components/UpNext.jsx'
import CoachCard from './components/CoachCard.jsx'
import AdminNudge from './components/AdminNudge.jsx'
import { buildItinerary } from './data.js'

const ROLE_LABELS = {
  admin: 'Admin',
  owner: 'Dealer Admin',
  manager: 'Manager',
  employee: 'Member',
  salesperson: 'Salesperson',
}

export default function Dashboard() {
  const { user, profile, isAdmin } = useAuth()

  const firstName = profile?.first_name || profile?.display_name || user?.email?.split('@')[0] || 'there'
  const initials = profile?.initials || (firstName ? firstName[0].toUpperCase() : 'T')
  const roleLabel = ROLE_LABELS[profile?.role] || (profile?.role ? profile.role : null)

  const itinerary = useMemo(() => buildItinerary(user?.id), [user?.id])

  return (
    <VStack align="stretch" spacing={8} maxW="920px">
      <GreetingHeader
        firstName={firstName}
        initials={initials}
        role={roleLabel}
        planCount={itinerary.plan.length}
        minutes={itinerary.plan.length * 5}
      />

      <TodaysPlan items={itinerary.plan} />

      <MomentumRow streakDays={itinerary.streakDays} course={itinerary.course} />

      {itinerary.upNext.length > 0 && <UpNext items={itinerary.upNext} />}

      <CoachCard firstName={firstName} currentStep={itinerary.currentStep} />

      {isAdmin && <AdminNudge />}
    </VStack>
  )
}
