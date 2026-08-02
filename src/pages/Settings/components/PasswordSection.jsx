// src/pages/Settings/components/PasswordSection.jsx
// STATUS: stable | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Header standardized; Phase 1 checkpoint committed (e765830).
// Change password. Requires the current password, then a new one (twice).

import { useState } from 'react'
import {
  VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement,
  IconButton, Button, Alert, AlertIcon, HStack, Text
} from '@chakra-ui/react'
import { Eye, EyeOff } from 'lucide-react'
import SectionCard from './SectionCard.jsx'
import { verifyCurrentPassword, updatePassword } from '../../../lib/auth'

export default function PasswordSection() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setDone(false)
    if (next.length < 8) return setError('New password must be at least 8 characters.')
    if (next !== confirm) return setError('New passwords do not match.')

    setSaving(true)
    const { ok, error: verifyError } = await verifyCurrentPassword(current)
    if (!ok) {
      setSaving(false)
      return setError(verifyError.message)
    }
    const { error: updateError } = await updatePassword(next)
    setSaving(false)
    if (updateError) return setError(updateError.message || 'Could not update password.')
    setDone(true)
    setCurrent(''); setNext(''); setConfirm('')
  }

  return (
    <SectionCard title="Password" description="Change your password. You will need your current one.">
      <form onSubmit={handleSubmit}>
        <VStack align="stretch" spacing={4}>
          {error && <Alert status="error" borderRadius="md" fontSize="sm" bg="red.50" color="red.800"><AlertIcon />{error}</Alert>}
          {done && <Alert status="success" borderRadius="md" fontSize="sm"><AlertIcon />Password updated.</Alert>}
          <FormControl isRequired>
            <FormLabel>Current password</FormLabel>
            <InputGroup>
              <Input type={show ? 'text' : 'password'} value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Current password" autoComplete="current-password" pr="3rem" />
              <InputRightElement>
                <IconButton aria-label="Toggle" icon={show ? <EyeOff size={18} /> : <Eye size={18} />} variant="ghost" size="sm" onClick={() => setShow((v) => !v)} color="inkMuted" _hover={{ color: 'ink', bg: 'transparent' }} />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>New password</FormLabel>
            <Input type={show ? 'text' : 'password'} value={next} onChange={(e) => setNext(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Confirm new password</FormLabel>
            <Input type={show ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter new password" autoComplete="new-password" />
          </FormControl>
          <HStack>
            <Button type="submit" isLoading={saving} loadingText="Saving" size="md">Update password</Button>
          </HStack>
        </VStack>
      </form>
    </SectionCard>
  )
}