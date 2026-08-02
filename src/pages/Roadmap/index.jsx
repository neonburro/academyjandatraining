// src/pages/Roadmap/index.jsx
// The Roadmap to the Sale. Vertical 13-step journey, mobile-first. Steps
// unlock sequentially; the current step is the visual anchor. Content comes
// from src/content/steps.js, progression from the local-first progress store.

import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Flex, HStack, VStack, Text, Icon, Progress } from '@chakra-ui/react'
import { Check, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { getProgress } from '../../lib/progressStore'

function StepRow({ step, isLast, onOpen }) {
  const done = step.passed
  const locked = !step.unlocked
  const isCurrent = step.unlocked && !step.passed

  return (
    <HStack
      align="stretch"
      spacing={4}
      cursor={locked ? 'default' : 'pointer'}
      onClick={() => !locked && onOpen(step)}
      role="group"
    >
      {/* rail */}
      <VStack spacing={0} w="34px" flexShrink={0}>
        <Flex
          boxSize="34px"
          borderRadius="full"
          align="center"
          justify="center"
          bg={done ? 'ink' : isCurrent ? 'white' : 'surface'}
          color={done ? 'white' : isCurrent ? 'ink' : 'inkDim'}
          border={isCurrent ? '2px solid' : '1px solid'}
          borderColor={done || isCurrent ? 'ink' : 'line'}
          fontSize="body-sm"
          fontWeight={600}
          flexShrink={0}
          transition="all 150ms"
        >
          {done ? <Check size={16} strokeWidth={3} /> : locked ? <Lock size={13} /> : step.number}
        </Flex>
        {!isLast && (
          <Box w="2px" flex={1} minH="18px" bg={done ? 'ink' : 'line'} borderRadius="full" />
        )}
      </VStack>

      {/* card */}
      <Box
        flex={1}
        mb={isLast ? 0 : 3}
        bg={isCurrent ? 'white' : 'transparent'}
        border="1px solid"
        borderColor={isCurrent ? 'lineStrong' : 'transparent'}
        borderRadius="card"
        px={isCurrent ? 4 : 1}
        py={isCurrent ? 4 : 1.5}
        transition="all 150ms"
        _groupHover={!locked ? { bg: 'white', borderColor: 'line' } : undefined}
      >
        <HStack justify="space-between" align="center">
          <Box>
            <Text
              fontSize={isCurrent ? 'body-lg' : 'body'}
              fontWeight={isCurrent ? 600 : 500}
              color={locked ? 'inkDim' : 'ink'}
              letterSpacing="-0.01em"
            >
              {step.title}
            </Text>
            {isCurrent && (
              <Text fontSize="body-sm" color="inkMuted" mt={1} noOfLines={2} lineHeight={1.5}>
                Pick up where you left off. Learn it, practice it, pass the check.
              </Text>
            )}
            {done && step.bestScore != null && (
              <Text fontSize="mono-xs" fontFamily="mono" color="inkDim" mt={0.5}>
                CHECK PASSED
              </Text>
            )}
          </Box>
          {isCurrent && <Icon as={ArrowRight} boxSize={4} color="ink" flexShrink={0} />}
        </HStack>
      </Box>
    </HStack>
  )
}

export default function Roadmap() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const progress = useMemo(() => getProgress(user?.id), [user?.id])

  const open = (step) => navigate(`/courses/roadmap/${step.slug}/`)

  return (
    <Box maxW="640px" mx="auto">
      <Box mb={6}>
        <Text fontSize="sm" color="inkMuted" mb={1}>
          The J13 Sales System
        </Text>
        <Text fontSize="display-md" fontWeight={600} letterSpacing="-0.02em" mb={3}>
          Roadmap to the Sale
        </Text>
        <HStack spacing={3}>
          <Progress
            value={progress.percent}
            size="xs"
            flex={1}
            borderRadius="full"
            bg="surface2"
            sx={{ '& > div': { background: 'var(--chakra-colors-ink)' } }}
          />
          <Text fontSize="mono-xs" fontFamily="mono" color="inkMuted" flexShrink={0}>
            {progress.completedCount}/{progress.totalCount}
          </Text>
        </HStack>
      </Box>

      <VStack align="stretch" spacing={0}>
        {progress.steps.map((step, i) => (
          <StepRow key={step.number} step={step} isLast={i === progress.steps.length - 1} onOpen={open} />
        ))}
      </VStack>
    </Box>
  )
}
