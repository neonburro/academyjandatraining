// src/pages/Dashboard.jsx
// Authenticated dashboard placeholder. Confirms auth + profile + dealership are wired.
// Real KPI tiles, progress widgets, recent activity etc. land in later cycles.

import { Box, Heading, Text, VStack, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react'
import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const { user, profile, dealership } = useAuth()
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'there'

  return (
    <VStack align="stretch" spacing={8} maxW="1200px">
      <Box>
        <Text fontSize="sm" color="inkMuted" mb={1}>
          Welcome back
        </Text>
        <Heading fontSize="3xl" fontFamily="display" fontWeight={400}>
          {displayName}
        </Heading>
        {dealership?.name && (
          <Text fontSize="md" color="inkMuted" mt={2}>
            {dealership.name}
          </Text>
        )}
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Box bg="white" p={6} borderRadius="lg" border="1px solid" borderColor="line">
          <Stat>
            <StatLabel color="inkMuted" fontSize="sm">Active Courses</StatLabel>
            <StatNumber fontSize="3xl">0</StatNumber>
            <StatHelpText fontSize="xs">Course library coming soon</StatHelpText>
          </Stat>
        </Box>
        <Box bg="white" p={6} borderRadius="lg" border="1px solid" borderColor="line">
          <Stat>
            <StatLabel color="inkMuted" fontSize="sm">Lessons Completed</StatLabel>
            <StatNumber fontSize="3xl">0</StatNumber>
            <StatHelpText fontSize="xs">Progress tracking coming soon</StatHelpText>
          </Stat>
        </Box>
        <Box bg="white" p={6} borderRadius="lg" border="1px solid" borderColor="line">
          <Stat>
            <StatLabel color="inkMuted" fontSize="sm">KPIs This Month</StatLabel>
            <StatNumber fontSize="3xl">0</StatNumber>
            <StatHelpText fontSize="xs">KPI tracker coming soon</StatHelpText>
          </Stat>
        </Box>
      </SimpleGrid>

      <Box bg="white" p={8} borderRadius="lg" border="1px solid" borderColor="line">
        <Text fontFamily="display" fontSize="xl" mb={3}>
          You are in. Foundation cycle complete.
        </Text>
        <Text fontSize="sm" color="inkMuted" lineHeight={1.7}>
          This is the J|13 Dealer Academy member portal. Course library, video lessons, progress tracking and KPI tools roll in over the next build cycles. Reach out to Jazz with questions or feedback.
        </Text>
      </Box>
    </VStack>
  )
}
