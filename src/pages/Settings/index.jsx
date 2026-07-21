// src/pages/Settings/index.jsx
// Account settings. Reached from the avatar menu. Clean black theme.
//
// Sections:
//   Account     read-only identity (name, username, email, role, dealership)
//   Password    change password, requires the current password
//   Email       change email, unlocked by entering the current password first
//   Session     sign out
//
// The "unlock" pattern on email: a walk-up cannot change the email of a
// logged-in session. The user must re-enter their password to unlock it.

import { VStack, Box, Heading, Text } from '@chakra-ui/react'
import { useAuth } from '../../hooks/useAuth'
import AccountSection from './components/AccountSection.jsx'
import PasswordSection from './components/PasswordSection.jsx'
import EmailSection from './components/EmailSection.jsx'
import SessionSection from './components/SessionSection.jsx'

export default function Settings() {
  const { user, profile, dealership, role } = useAuth()

  return (
    <VStack align="stretch" spacing={10} maxW="720px">
      <Box>
        <Text fontSize="xs" color="inkMuted" letterSpacing="0.08em" textTransform="uppercase" mb={2}>
          Account
        </Text>
        <Heading fontSize="display-lg" fontWeight={500} color="ink">
          Settings
        </Heading>
      </Box>

      <AccountSection profile={profile} user={user} dealership={dealership} role={role} />
      <PasswordSection />
      <EmailSection currentEmail={user?.email} />
      <SessionSection />
    </VStack>
  )
}