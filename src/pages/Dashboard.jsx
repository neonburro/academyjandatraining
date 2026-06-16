// src/pages/Dashboard.jsx
// "Today" hub. Greeting, today's plan (checklist), next live event card,
// team-at-a-glance row, quick links into other surfaces.

import { Link as RouterLink } from 'react-router-dom'
import {
  Box, Heading, Text, VStack, HStack, SimpleGrid, Icon, Button, Flex, Badge, Spacer, Divider
} from '@chakra-ui/react'
import { Calendar, Users, Sparkles, BookOpen, ArrowRight, Circle, PlayCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { SEED_EVENTS, EVENT_TYPES, formatEventDate, formatEventTime } from '../data/seed'

function ChecklistItem({ icon: IconComponent, label, helper, done }) {
  return (
    <HStack
      spacing={4}
      px={5}
      py={4}
      bg="white"
      borderRadius="card"
      border="1px solid"
      borderColor="line"
      _hover={{ borderColor: 'lineStrong' }}
      transition="border-color 150ms"
    >
      <Icon
        as={done ? Circle : IconComponent}
        boxSize={5}
        color={done ? 'inkDim' : 'brand.500'}
      />
      <Box flex={1}>
        <Text
          fontSize="sm"
          fontWeight={500}
          color="ink"
          textDecoration={done ? 'line-through' : 'none'}
        >
          {label}
        </Text>
        {helper && (
          <Text fontSize="xs" color="inkMuted" mt={0.5}>
            {helper}
          </Text>
        )}
      </Box>
      <Icon as={ArrowRight} boxSize={4} color="inkDim" />
    </HStack>
  )
}

function NextEventCard({ event }) {
  const meta = EVENT_TYPES[event.type]
  return (
    <Box
      bg="white"
      borderRadius="cardLg"
      border="1px solid"
      borderColor="line"
      overflow="hidden"
    >
      <Box bg={meta.bgSoft} px={6} py={4}>
        <HStack spacing={3}>
          <Box w={2} h={2} borderRadius="full" bg={meta.color} />
          <Text
            fontSize="xs"
            fontWeight={600}
            color={meta.color}
            letterSpacing="0.08em"
            textTransform="uppercase"
          >
            {meta.label}
          </Text>
          <Spacer />
          <Text fontSize="xs" color="inkMuted">
            Next up
          </Text>
        </HStack>
      </Box>
      <Box p={6}>
        <Heading fontSize="display-md" fontWeight={500} color="ink" mb={2}>
          {event.title}
        </Heading>
        <Text fontSize="sm" color="inkMuted" mb={4}>
          {formatEventDate(event.startAt)} &middot; {formatEventTime(event.startAt)}
        </Text>
        <Text fontSize="sm" color="ink" lineHeight={1.6} mb={5}>
          {event.description}
        </Text>
        <HStack spacing={3}>
          <Button
            as="a"
            href={event.joinUrl}
            target="_blank"
            rel="noopener noreferrer"
            leftIcon={<PlayCircle size={16} />}
            size="md"
          >
            Reserve a spot
          </Button>
          <Button as={RouterLink} to="/calendar/" variant="outline" size="md">
            View calendar
          </Button>
        </HStack>
      </Box>
    </Box>
  )
}

function QuickLinkCard({ to, icon: IconComponent, label, helper }) {
  return (
    <RouterLink to={to} style={{ textDecoration: 'none' }}>
      <Box
        bg="white"
        p={5}
        borderRadius="card"
        border="1px solid"
        borderColor="line"
        _hover={{ borderColor: 'lineStrong', transform: 'translateY(-1px)' }}
        transition="all 150ms"
        h="full"
      >
        <Icon as={IconComponent} boxSize={5} color="brand.500" mb={3} />
        <Text fontSize="sm" fontWeight={600} color="ink" mb={1}>
          {label}
        </Text>
        <Text fontSize="xs" color="inkMuted" lineHeight={1.5}>
          {helper}
        </Text>
      </Box>
    </RouterLink>
  )
}

export default function Dashboard() {
  const { user, profile, dealership } = useAuth()
  const displayName = profile?.display_name || profile?.full_name || user?.email?.split('@')[0] || 'there'
  const nextEvent = SEED_EVENTS[0]

  return (
    <VStack align="stretch" spacing={10} maxW="1200px">
      <Box>
        <Text fontSize="xs" color="inkMuted" letterSpacing="0.08em" textTransform="uppercase" mb={2}>
          Today
        </Text>
        <Heading fontSize="display-lg" fontWeight={500} color="ink">
          Good to see you, {displayName}.
        </Heading>
        {dealership?.name && (
          <Text fontSize="md" color="inkMuted" mt={2}>
            {dealership.name}
          </Text>
        )}
      </Box>

      <Box>
        <HStack mb={4}>
          <Heading fontSize="display-sm" fontWeight={600} color="ink">
            Today's plan
          </Heading>
          <Badge bg="surface" color="inkMuted" fontWeight={500} fontSize="xs" px={2} py={0.5} borderRadius="pill">
            3 items
          </Badge>
        </HStack>
        <VStack align="stretch" spacing={3}>
          <ChecklistItem
            icon={PlayCircle}
            label="Watch: Titanium Trade-In Objections (preview)"
            helper="12 min &middot; F&I &middot; Releases June 26"
          />
          <ChecklistItem
            icon={Users}
            label="Review team progress for the week"
            helper="3 reps behind schedule"
          />
          <ChecklistItem
            icon={Sparkles}
            label="Log this week's F&I PVR for your dealership"
            helper="Last entry: 7 days ago"
          />
        </VStack>
      </Box>

      {nextEvent && <NextEventCard event={nextEvent} />}

      <Box>
        <Heading fontSize="display-sm" fontWeight={600} color="ink" mb={4}>
          Jump in
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          <QuickLinkCard
            to="/calendar/"
            icon={Calendar}
            label="Calendar"
            helper="Live trainings, content drops, deadlines"
          />
          <QuickLinkCard
            to="/team/"
            icon={Users}
            label="Team"
            helper="Who's training, who's behind, what to nudge"
          />
          <QuickLinkCard
            to="/courses/"
            icon={BookOpen}
            label="Courses"
            helper="The full lesson library"
          />
          <QuickLinkCard
            to="/insights/"
            icon={Sparkles}
            label="Insights"
            helper="Smart suggestions and Academy AI"
          />
        </SimpleGrid>
      </Box>

      <Divider borderColor="line" />

      <Box bg="surface" p={6} borderRadius="card">
        <Text fontSize="sm" color="inkMuted" lineHeight={1.7}>
          <Text as="span" fontWeight={600} color="ink">Foundation cycle complete.</Text> The Academy is wired and your team is ready to be invited. Course library, KPI tracking, and AI coaching layer in next.
        </Text>
      </Box>
    </VStack>
  )
}
