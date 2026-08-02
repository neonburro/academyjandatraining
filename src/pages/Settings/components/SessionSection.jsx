// src/pages/Settings/components/SessionSection.jsx
// STATUS: stable | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Header standardized; Phase 1 checkpoint committed (e765830).
// Sign out of this session.

import { useNavigate } from 'react-router-dom'
import { HStack, Button, Text, VStack } from '@chakra-ui/react'
import { LogOut } from 'lucide-react'
import SectionCard from './SectionCard.jsx'
import { signOut } from '../../../lib/auth'

export default function SessionSection() {
  const navigate = useNavigate()
  const handleSignOut = async () => {
    await signOut()
    navigate('/login/', { replace: true })
  }
  return (
    <SectionCard title="Session">
      <HStack justify="space-between" flexDir={{ base: 'column', sm: 'row' }} align={{ base: 'stretch', sm: 'center' }} spacing={4}>
        <Text fontSize="sm" color="inkMuted">Sign out of the Academy on this device.</Text>
        <Button onClick={handleSignOut} variant="outline" size="md" leftIcon={<LogOut size={16} />} flexShrink={0}>Log out</Button>
      </HStack>
    </SectionCard>
  )
}