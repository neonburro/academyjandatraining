// src/pages/Dashboard/components/TodaysPlan.jsx
// The itinerary. Ordered cards for today: lesson, quiz, reflection. Each item
// carries a `to` route and navigates on tap. Data comes from buildItinerary,
// derived from the user's real Roadmap position.

import { useNavigate } from 'react-router-dom'
import { Box, Flex, HStack, VStack, Heading, Text, Icon, Badge } from '@chakra-ui/react'
import { PlayCircle, HelpCircle, PenLine, ArrowRight } from 'lucide-react'

const KIND_META = {
  lesson: { icon: PlayCircle, tag: 'Lesson' },
  quiz: { icon: HelpCircle, tag: 'Quiz' },
  reflection: { icon: PenLine, tag: 'Habit' },
}

function PlanItem({ item }) {
  const meta = KIND_META[item.kind] || KIND_META.lesson
  const navigate = useNavigate()
  return (
    <HStack
      onClick={() => item.to && navigate(item.to)}
      spacing={4}
      px={5}
      py={4}
      bg="white"
      borderRadius="card"
      border="1px solid"
      borderColor="line"
      _hover={{ borderColor: 'lineStrong', transform: 'translateY(-1px)' }}
      transition="all 150ms"
      cursor="pointer"
      role="group"
    >
      <Flex w={9} h={9} borderRadius="full" bg="surface" align="center" justify="center" flexShrink={0}>
        <Icon as={meta.icon} boxSize={4} color="ink" />
      </Flex>
      <Box flex={1} minW={0}>
        <Text fontSize="sm" fontWeight={600} color="ink" noOfLines={1} mb={0.5}>
          {item.label}
        </Text>
        <Text fontSize="xs" color="inkMuted">
          {item.helper} &middot; {item.meta}
        </Text>
      </Box>
      <Badge bg="surface" color="inkMuted" fontWeight={500} fontSize="10px" px={2} py={0.5} borderRadius="pill" textTransform="uppercase" letterSpacing="0.06em">
        {meta.tag}
      </Badge>
      <Icon as={ArrowRight} boxSize={4} color="inkDim" _groupHover={{ color: 'ink' }} transition="color 150ms" />
    </HStack>
  )
}

export default function TodaysPlan({ items }) {
  return (
    <Box>
      <HStack mb={4} spacing={3}>
        <Heading fontSize="display-sm" fontWeight={600} color="ink">
          Today's plan
        </Heading>
      </HStack>
      <VStack align="stretch" spacing={3}>
        {items.map((item) => (
          <PlanItem key={item.id} item={item} />
        ))}
      </VStack>
    </Box>
  )
}