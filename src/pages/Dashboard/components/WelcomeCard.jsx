// src/pages/Dashboard/components/WelcomeCard.jsx
// STATUS: active | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  New: first-run onboarding. Shows only while the user has zero
//               progress; explains the J13 loop in one glance and points at
//               Step 1. Disappears forever once real progress exists.
// The first thing a brand-new member sees. One card, the whole method.

import { useNavigate } from 'react-router-dom'
import { Box, HStack, Text, Flex, Button, Icon } from '@chakra-ui/react'
import { ArrowRight, BookOpen, MessageCircle, ClipboardCheck, PenLine } from 'lucide-react'

const LOOP = [
  { icon: BookOpen, label: 'Learn', detail: 'the step and its word tracks' },
  { icon: MessageCircle, label: 'Practice', detail: 'with the Coach' },
  { icon: ClipboardCheck, label: 'Check', detail: 'pass at 80 percent' },
  { icon: PenLine, label: 'Commit', detail: 'to one behavior on your next customer' },
]

export default function WelcomeCard({ firstName }) {
  const navigate = useNavigate()
  return (
    <Box bg="ink" color="white" borderRadius="cardLg" p={{ base: 6, md: 8 }}>
      <Text fontSize="mono-xs" fontFamily="mono" textTransform="uppercase" letterSpacing="0.1em" color="whiteAlpha.700" mb={3}>
        Welcome to the Academy
      </Text>
      <Text fontSize="display-md" fontWeight={600} letterSpacing="-0.02em" lineHeight={1.2} mb={2}>
        {firstName ? `${firstName}, this` : 'This'} is the Roadmap to the Sale.
      </Text>
      <Text fontSize="body" color="whiteAlpha.800" lineHeight={1.65} maxW="480px" mb={6}>
        Thirteen steps, one professional process. Every step works the same way:
      </Text>

      <HStack
        spacing={0}
        mb={7}
        align="stretch"
        flexWrap={{ base: 'wrap', md: 'nowrap' }}
        gap={{ base: 3, md: 0 }}
      >
        {LOOP.map((item, i) => (
          <HStack key={item.label} flex={{ md: 1 }} spacing={3} pr={{ md: 4 }} minW={{ base: '45%', md: 0 }}>
            <Flex boxSize="34px" borderRadius="full" bg="whiteAlpha.200" align="center" justify="center" flexShrink={0}>
              <Icon as={item.icon} boxSize={4} />
            </Flex>
            <Box>
              <Text fontWeight={600} fontSize="body-sm" lineHeight={1.2}>
                {i + 1}. {item.label}
              </Text>
              <Text fontSize="xs" color="whiteAlpha.700" lineHeight={1.35}>
                {item.detail}
              </Text>
            </Box>
          </HStack>
        ))}
      </HStack>

      <Button
        bg="white"
        color="ink"
        _hover={{ bg: 'whiteAlpha.900' }}
        _active={{ bg: 'whiteAlpha.800' }}
        rightIcon={<ArrowRight size={16} />}
        onClick={() => navigate('/courses/roadmap/meet-and-greet/')}
      >
        Start Step 1: Meet & Greet
      </Button>
    </Box>
  )
}
