// src/pages/Dashboard/index.jsx
// STATUS: active | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Daily check-in (commitment inspection) + first-run welcome
//               card. Zero placeholder content remains on this page.
//   2026-08-02  Header standardized; Phase 1 checkpoint committed (e765830).
// The daily itinerary. First-run users get the Welcome card explaining the
// J13 loop. Returning users get the check-in on any aged commitment, then
// today's plan, momentum, up-next and the live coach card. Everything derives
// from real progress via buildItinerary.

import { useMemo, useState } from 'react'
import { VStack } from '@chakra-ui/react'
import { useAuth } from '../../hooks/useAuth'
import GreetingHeader from './components/GreetingHeader.jsx'
import WelcomeCard from './components/WelcomeCard.jsx'
import DailyCheckIn from './components/DailyCheckIn.jsx'
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

function todayKeyUTC() {
  return new Date().toISOString().slice(0, 10)
}

export default function Dashboard() {
  const { user, profile, isAdmin } = useAuth()
  const [refresh, setRefresh] = useState(0)

  const firstName = profile?.first_name || profile?.display_name || user?.email?.split('@')[0] || 'there'
  const initials = profile?.initials || (firstName ? firstName[0].toUpperCase() : 'T')
  const roleLabel = ROLE_LABELS[profile?.role] || (profile?.role ? profile.role : null)

  const itinerary = useMemo(() => buildItinerary(user?.id), [user?.id, refresh])

  // A commitment is due for inspection once it was made before today.
  const checkInCommitment = itinerary.openCommitments.find(
    (c) => (c.createdAt || '').slice(0, 10) < todayKeyUTC()
  )

  return (
    <VStack align="stretch" spacing={8} maxW="920px">
      <GreetingHeader
        firstName={firstName}
        initials={initials}
        role={roleLabel}
        planCount={itinerary.plan.length}
        minutes={itinerary.plan.length * 5}
      />

      {itinerary.isNewUser && (
        <WelcomeCard firstName={profile?.first_name || profile?.display_name ? firstName : null} />
      )}

      {checkInCommitment && (
        <DailyCheckIn
          userId={user?.id}
          commitment={checkInCommitment}
          onResolved={() => setRefresh((r) => r + 1)}
        />
      )}

      <TodaysPlan items={itinerary.plan} />

      <MomentumRow streakDays={itinerary.streakDays} course={itinerary.course} />

      {itinerary.upNext.length > 0 && <UpNext items={itinerary.upNext} />}

      {!itinerary.isNewUser && <CoachCard firstName={firstName} currentStep={itinerary.currentStep} />}

      {isAdmin && <AdminNudge />}
    </VStack>
  )
}
