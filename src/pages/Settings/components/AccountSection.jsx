// src/pages/Settings/components/AccountSection.jsx
// Read-only identity summary.

import { VStack, HStack, Text, Box, Flex } from '@chakra-ui/react'
import SectionCard from './SectionCard.jsx'

function Row({ label, value }) {
  return (
    <HStack justify="space-between" py={3} borderBottom="1px solid" borderColor="line" _last={{ borderBottom: 'none' }}>
      <Text fontSize="xs" fontWeight={600} color="inkMuted" letterSpacing="0.06em" textTransform="uppercase">
        {label}
      </Text>
      <Text fontSize="sm" color="ink" textAlign="right">
        {value || '—'}
      </Text>
    </HStack>
  )
}

export default function AccountSection({ profile, user, dealership, role }) {
  const name = profile?.full_name || profile?.display_name || '—'
  return (
    <SectionCard title="Your account">
      <HStack spacing={4} mb={1}>
        <Flex w={12} h={12} borderRadius="full" bg="ink" color="white" align="center" justify="center" fontWeight={600} flexShrink={0}>
          {profile?.initials || (name !== '—' ? name[0] : 'U')}
        </Flex>
        <Box>
          <Text fontSize="md" fontWeight={600} color="ink">{name}</Text>
          <Text fontSize="sm" color="inkMuted" textTransform="capitalize">{role || 'Member'}</Text>
        </Box>
      </HStack>
      <VStack align="stretch" spacing={0} mt={2}>
        <Row label="Username" value={profile?.username} />
        <Row label="Email" value={user?.email} />
        <Row label="Dealership" value={dealership?.name} />
      </VStack>
    </SectionCard>
  )
}