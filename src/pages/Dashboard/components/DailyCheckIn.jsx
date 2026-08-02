// src/pages/Dashboard/components/DailyCheckIn.jsx
// STATUS: active | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  New: the daily accountability moment. Surfaces the user's own
//               next-customer commitment and asks the J13 question: did you
//               do it? Kept and missed both resolve honestly; missed routes
//               to the Coach for a rep.
// The core J13 loop is commitment then inspection. This card is the
// self-inspection half: it appears once a commitment has aged past the day it
// was made and disappears once answered.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, HStack, VStack, Text, Flex, Icon, Button } from '@chakra-ui/react'
import { CheckCircle2, Target } from 'lucide-react'
import { resolveCommitment } from '../../../lib/progressStore'

export default function DailyCheckIn({ userId, commitment, onResolved }) {
  const [answered, setAnswered] = useState(null)
  const navigate = useNavigate()

  if (!commitment) return null

  const resolve = (status) => {
    resolveCommitment(userId, commitment.id, status)
    setAnswered(status)
  }

  if (answered === 'kept') {
    return (
      <HStack bg="white" border="1px solid" borderColor="line" borderRadius="card" p={5} spacing={4}>
        <Flex boxSize="38px" borderRadius="full" bg="ink" color="white" align="center" justify="center" flexShrink={0}>
          <Icon as={CheckCircle2} boxSize={5} />
        </Flex>
        <Box flex={1}>
          <Text fontWeight={600} letterSpacing="-0.01em">
            That is how the process sticks.
          </Text>
          <Text fontSize="body-sm" color="inkMuted">
            Kept commitments are what separate trained from certified.
          </Text>
        </Box>
        <Button size="sm" variant="ghost" onClick={onResolved}>
          Done
        </Button>
      </HStack>
    )
  }

  if (answered === 'missed') {
    return (
      <HStack bg="white" border="1px solid" borderColor="line" borderRadius="card" p={5} spacing={4}>
        <Flex boxSize="38px" borderRadius="full" bg="accent.soft" color="accent.500" align="center" justify="center" flexShrink={0}>
          <Icon as={Target} boxSize={5} />
        </Flex>
        <Box flex={1}>
          <Text fontWeight={600} letterSpacing="-0.01em">
            No problem. Run it with the Coach first.
          </Text>
          <Text fontSize="body-sm" color="inkMuted">
            Two minutes of practice makes it automatic on the next customer.
          </Text>
        </Box>
        <HStack flexShrink={0}>
          <Button size="sm" onClick={() => navigate('/coach/')}>
            Practice
          </Button>
          <Button size="sm" variant="ghost" onClick={onResolved}>
            Later
          </Button>
        </HStack>
      </HStack>
    )
  }

  return (
    <Box bg="white" border="1px solid" borderColor="lineStrong" borderRadius="card" p={5}>
      <HStack spacing={3} mb={3}>
        <Icon as={Target} boxSize={4} color="accent.500" />
        <Text fontSize="mono-xs" fontFamily="mono" textTransform="uppercase" letterSpacing="0.1em" color="inkMuted">
          Daily check-in
        </Text>
      </HStack>
      <Text fontSize="body-lg" fontWeight={600} letterSpacing="-0.01em" mb={1}>
        You committed to this on your next customer:
      </Text>
      <Text fontSize="body" color="inkMuted" fontStyle="italic" lineHeight={1.6} mb={4}>
        "{commitment.body}"
      </Text>
      <Text fontSize="body-sm" fontWeight={600} mb={3}>
        Did you do it?
      </Text>
      <HStack>
        <Button size="sm" onClick={() => resolve('kept')}>
          I did it
        </Button>
        <Button size="sm" variant="outline" onClick={() => resolve('missed')}>
          Not yet
        </Button>
      </HStack>
    </Box>
  )
}
