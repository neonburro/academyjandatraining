// src/pages/Dashboard/components/MomentumRow.jsx
// Streak badge + current course progress bar. The daily-habit momentum cue and
// a sense of progress through the active course.

import { Box, HStack, VStack, Text, Flex, Icon } from '@chakra-ui/react'
import { Flame } from 'lucide-react'

function StreakBadge({ days }) {
  return (
    <HStack
      spacing={3}
      px={5}
      py={4}
      bg="white"
      borderRadius="card"
      border="1px solid"
      borderColor="line"
      flex={1}
    >
      <Flex w={9} h={9} borderRadius="full" bg="accent.soft" align="center" justify="center" flexShrink={0}>
        <Icon as={Flame} boxSize={4} color="accent.500" />
      </Flex>
      <Box>
        <Text fontSize="lg" fontWeight={700} color="ink" lineHeight={1}>
          Day {days}
        </Text>
        <Text fontSize="xs" color="inkMuted" mt={0.5}>
          Keep the streak going
        </Text>
      </Box>
    </HStack>
  )
}

function CourseProgress({ course }) {
  const pct = course.total ? Math.round((course.completed / course.total) * 100) : 0
  return (
    <Box px={5} py={4} bg="white" borderRadius="card" border="1px solid" borderColor="line" flex={2}>
      <HStack mb={2.5} justify="space-between">
        <Text fontSize="sm" fontWeight={600} color="ink">
          {course.title}
        </Text>
        <Text fontSize="xs" color="inkMuted" fontFamily="mono">
          {course.completed} / {course.total}
        </Text>
      </HStack>
      <Box h="6px" bg="surface" borderRadius="full" overflow="hidden">
        <Box h="full" w={`${pct}%`} bg="ink" borderRadius="full" transition="width 400ms" />
      </Box>
    </Box>
  )
}

export default function MomentumRow({ streakDays, course }) {
  return (
    <HStack align="stretch" spacing={4} flexDir={{ base: 'column', sm: 'row' }}>
      <StreakBadge days={streakDays} />
      <CourseProgress course={course} />
    </HStack>
  )
}