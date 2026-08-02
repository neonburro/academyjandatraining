// src/pages/Courses.jsx
// Training hub. The Roadmap to the Sale is the flagship track and visual
// anchor; future tracks (Finance, Management) render as coming-soon cards so
// the hub communicates the full J13 scope without shipping shallow shells.

import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Flex, HStack, VStack, Text, Icon, Progress, Button } from '@chakra-ui/react'
import { ArrowRight, Landmark, Map, Users } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getProgress } from '../lib/progressStore'

const UPCOMING_TRACKS = [
  {
    title: 'Finance & Business Office',
    description: 'Warm handoffs, the five-step menu, the 300% rule, PVR and compliant presentations.',
    icon: Landmark,
  },
  {
    title: 'Management Operating System',
    description: 'Morning meetings, one-on-ones, CRM inspection, save-a-deal and the daily process audit.',
    icon: Users,
  },
]

export default function Courses() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const progress = useMemo(() => getProgress(user?.id), [user?.id])

  const started = progress.completedCount > 0 || progress.steps.some((s) => s.status === 'in_progress')

  return (
    <VStack align="stretch" spacing={6} maxW="760px" mx="auto">
      <Box>
        <Text fontSize="sm" color="inkMuted" mb={1}>
          Your curriculum
        </Text>
        <Text fontSize="display-md" fontWeight={600} letterSpacing="-0.02em">
          Training
        </Text>
      </Box>

      {/* Flagship: Roadmap to the Sale */}
      <Box
        bg="ink"
        color="white"
        borderRadius="cardLg"
        p={{ base: 6, md: 8 }}
        cursor="pointer"
        onClick={() => navigate('/courses/roadmap/')}
        transition="transform 150ms"
        _hover={{ transform: 'translateY(-2px)' }}
      >
        <HStack justify="space-between" align="flex-start" mb={5}>
          <Flex boxSize="42px" borderRadius="full" bg="whiteAlpha.200" align="center" justify="center">
            <Icon as={Map} boxSize={5} />
          </Flex>
          <Text fontSize="mono-xs" fontFamily="mono" textTransform="uppercase" letterSpacing="0.1em" color="whiteAlpha.700">
            The J13 System
          </Text>
        </HStack>
        <Text fontSize="display-md" fontWeight={600} letterSpacing="-0.02em" mb={1}>
          Roadmap to the Sale
        </Text>
        <Text fontSize="body" color="whiteAlpha.800" lineHeight={1.6} mb={6} maxW="440px">
          The complete 13-step customer journey. Word tracks, practice labs and knowledge checks for every step.
        </Text>
        <HStack spacing={4}>
          <Button
            bg="white"
            color="ink"
            _hover={{ bg: 'whiteAlpha.900' }}
            _active={{ bg: 'whiteAlpha.800' }}
            rightIcon={<ArrowRight size={16} />}
            onClick={(e) => {
              e.stopPropagation()
              navigate('/courses/roadmap/')
            }}
          >
            {started ? 'Continue' : 'Start Step 1'}
          </Button>
          <HStack flex={1} spacing={3} maxW="220px">
            <Progress
              value={progress.percent}
              size="xs"
              flex={1}
              borderRadius="full"
              bg="whiteAlpha.300"
              sx={{ '& > div': { background: 'white' } }}
            />
            <Text fontSize="mono-xs" fontFamily="mono" color="whiteAlpha.700" flexShrink={0}>
              {progress.completedCount}/{progress.totalCount}
            </Text>
          </HStack>
        </HStack>
      </Box>

      {/* Upcoming tracks */}
      <VStack align="stretch" spacing={3}>
        {UPCOMING_TRACKS.map((track) => (
          <HStack
            key={track.title}
            bg="white"
            border="1px solid"
            borderColor="line"
            borderRadius="card"
            p={5}
            spacing={4}
            opacity={0.75}
          >
            <Flex boxSize="40px" borderRadius="full" bg="surface" align="center" justify="center" flexShrink={0}>
              <Icon as={track.icon} boxSize={4.5} color="inkMuted" />
            </Flex>
            <Box flex={1}>
              <HStack spacing={2} mb={0.5}>
                <Text fontWeight={600} letterSpacing="-0.01em">
                  {track.title}
                </Text>
                <Text fontSize="mono-xs" fontFamily="mono" textTransform="uppercase" letterSpacing="0.08em" color="inkDim" bg="surface" px={2} py={0.5} borderRadius="pill">
                  Soon
                </Text>
              </HStack>
              <Text fontSize="body-sm" color="inkMuted" lineHeight={1.5}>
                {track.description}
              </Text>
            </Box>
          </HStack>
        ))}
      </VStack>
    </VStack>
  )
}
