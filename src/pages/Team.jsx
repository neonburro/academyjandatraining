// src/pages/Team.jsx
// Team progress board. Empty state for now since no team members have been
// invited. Frames the future state clearly so Jazz sees what this becomes.

import { Box, Heading, Text, VStack, HStack, Button, SimpleGrid, Icon, Badge } from '@chakra-ui/react'
import { Users, UserPlus, TrendingUp, Award } from 'lucide-react'

function StatRow({ icon: IconComponent, label, value, helper }) {
  return (
    <Box bg="white" p={5} borderRadius="card" border="1px solid" borderColor="line">
      <HStack spacing={3} mb={3}>
        <Icon as={IconComponent} boxSize={4} color="brand.500" />
        <Text fontSize="xs" color="inkMuted" letterSpacing="0.06em" textTransform="uppercase">
          {label}
        </Text>
      </HStack>
      <Heading fontSize="2xl" fontWeight={500} color="ink" mb={1}>
        {value}
      </Heading>
      <Text fontSize="xs" color="inkMuted">
        {helper}
      </Text>
    </Box>
  )
}

export default function Team() {
  return (
    <VStack align="stretch" spacing={10} maxW="1200px">
      <Box>
        <Text fontSize="xs" color="inkMuted" letterSpacing="0.08em" textTransform="uppercase" mb={2}>
          Your team
        </Text>
        <HStack align="flex-start">
          <Box flex={1}>
            <Heading fontSize="display-lg" fontWeight={500} color="ink">
              Team
            </Heading>
            <Text fontSize="md" color="inkMuted" mt={2}>
              Bring your dealership into the Academy. Track training, set goals, hold the line.
            </Text>
          </Box>
          <Button leftIcon={<UserPlus size={16} />} size="md">
            Invite team member
          </Button>
        </HStack>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        <StatRow
          icon={Users}
          label="Active members"
          value="0"
          helper="No team invited yet"
        />
        <StatRow
          icon={TrendingUp}
          label="This week's completions"
          value="0"
          helper="Lessons completed across team"
        />
        <StatRow
          icon={Award}
          label="Avg. completion rate"
          value="-"
          helper="Across all assigned content"
        />
      </SimpleGrid>

      <Box
        bg="white"
        borderRadius="cardLg"
        border="1px dashed"
        borderColor="lineStrong"
        p={{ base: 8, md: 12 }}
        textAlign="center"
      >
        <Box
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          w={14}
          h={14}
          bg="brand.50"
          color="brand.500"
          borderRadius="full"
          mb={5}
        >
          <Icon as={Users} boxSize={6} />
        </Box>
        <Heading fontSize="display-sm" fontWeight={600} color="ink" mb={3}>
          Build your team
        </Heading>
        <Text fontSize="sm" color="inkMuted" maxW="md" mx="auto" mb={6} lineHeight={1.7}>
          Invite each role with the right level of access. Sales reps see their own progress. Managers see the team. Owners see the floor.
        </Text>
        <HStack spacing={3} justify="center" flexWrap="wrap">
          <Badge bg="surface" color="ink" fontWeight={500} fontSize="xs" px={3} py={1.5} borderRadius="pill">
            Sales reps
          </Badge>
          <Badge bg="surface" color="ink" fontWeight={500} fontSize="xs" px={3} py={1.5} borderRadius="pill">
            F&I producers
          </Badge>
          <Badge bg="surface" color="ink" fontWeight={500} fontSize="xs" px={3} py={1.5} borderRadius="pill">
            Service writers
          </Badge>
          <Badge bg="surface" color="ink" fontWeight={500} fontSize="xs" px={3} py={1.5} borderRadius="pill">
            Parts managers
          </Badge>
          <Badge bg="surface" color="ink" fontWeight={500} fontSize="xs" px={3} py={1.5} borderRadius="pill">
            GMs &amp; owners
          </Badge>
        </HStack>
      </Box>

      <Box bg="surface" p={6} borderRadius="card">
        <Text fontSize="xs" color="inkMuted" letterSpacing="0.08em" textTransform="uppercase" mb={2}>
          Coming next cycle
        </Text>
        <Text fontSize="sm" color="ink" lineHeight={1.7}>
          Granular permissions. Hide financial data from sales reps. Show team progress to managers. Batch assign lessons to roles. Send training reminders by SMS or email.
        </Text>
      </Box>
    </VStack>
  )
}
