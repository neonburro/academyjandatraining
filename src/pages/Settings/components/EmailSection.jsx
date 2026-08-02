// src/pages/Settings/components/EmailSection.jsx
// STATUS: stable | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Header standardized; Phase 1 checkpoint committed (e765830).
// Change email. Locked by default. The user unlocks by entering their current
// password, then can enter a new email. Supabase sends a confirmation link to
// the new address; the change only applies after they click it.

import { useState } from 'react'
import {
  VStack, HStack, FormControl, FormLabel, Input, Button, Alert, AlertIcon, Text, Icon
} from '@chakra-ui/react'
import { Lock } from 'lucide-react'
import SectionCard from './SectionCard.jsx'
import { verifyCurrentPassword, changeEmail } from '../../../lib/auth'

export default function EmailSection({ currentEmail }) {
  const [unlocked, setUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [sent, setSent] = useState(false)

  const handleUnlock = async (e) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    const { ok, error: verifyError } = await verifyCurrentPassword(password)
    setBusy(false)
    if (!ok) return setError(verifyError.message)
    setUnlocked(true)
    setPassword('')
  }

  const handleChange = async (e) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    const { error: changeError } = await changeEmail(newEmail)
    setBusy(false)
    if (changeError) return setError(changeError.message || 'Could not change email.')
    setSent(true)
  }

  return (
    <SectionCard title="Email" description={`Your login email is ${currentEmail || '—'}. Changing it requires your password.`}>
      {sent ? (
        <Alert status="success" borderRadius="md" fontSize="sm"><AlertIcon />Check your new inbox. Click the confirmation link to finish changing your email.</Alert>
      ) : !unlocked ? (
        <form onSubmit={handleUnlock}>
          <VStack align="stretch" spacing={4}>
            {error && <Alert status="error" borderRadius="md" fontSize="sm" bg="red.50" color="red.800"><AlertIcon />{error}</Alert>}
            <FormControl isRequired>
              <FormLabel>Enter your password to unlock</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Current password" autoComplete="current-password" />
            </FormControl>
            <HStack>
              <Button type="submit" isLoading={busy} loadingText="Verifying" size="md" leftIcon={<Lock size={15} />}>Unlock email change</Button>
            </HStack>
          </VStack>
        </form>
      ) : (
        <form onSubmit={handleChange}>
          <VStack align="stretch" spacing={4}>
            {error && <Alert status="error" borderRadius="md" fontSize="sm" bg="red.50" color="red.800"><AlertIcon />{error}</Alert>}
            <FormControl isRequired>
              <FormLabel>New email</FormLabel>
              <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="you@dealership.com" autoComplete="email" />
            </FormControl>
            <HStack>
              <Button type="submit" isLoading={busy} loadingText="Sending" size="md">Send confirmation</Button>
            </HStack>
          </VStack>
        </form>
      )}
    </SectionCard>
  )
}