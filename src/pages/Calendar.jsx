// src/pages/Calendar.jsx
// Full-screen calendar. Monthly view with event chips on the dates. Click an
// event to open a detail side panel. Stub data from src/data/seed.js for now;
// will swap to Supabase later.

import { useState, useMemo } from 'react'
import {
  Box, Flex, Heading, Text, HStack, VStack, IconButton, Button, Badge,
  Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody,
  useDisclosure, Divider
} from '@chakra-ui/react'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { SEED_EVENTS, EVENT_TYPES, formatEventDate, formatEventTime, isSameDay } from '../data/seed'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getMonthGrid(year, month) {
  const firstOfMonth = new Date(year, month, 1)
  const startWeekday = firstOfMonth.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells = []
  for (let i = startWeekday - 1; i >= 0; i--) {
    cells.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      inMonth: false,
    })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true })
  }
  while (cells.length % 7 !== 0) {
    const lastDate = cells[cells.length - 1].date
    cells.push({
      date: new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() + 1),
      inMonth: false,
    })
  }
  return cells
}

function EventChip({ event, onClick }) {
  const meta = EVENT_TYPES[event.type]
  return (
    <Box
      onClick={(e) => {
        e.stopPropagation()
        onClick(event)
      }}
      px={2}
      py={1}
      mb={1}
      bg={meta.bgSoft}
      borderRadius="md"
      cursor="pointer"
      _hover={{ filter: 'brightness(0.96)' }}
      transition="filter 150ms"
    >
      <HStack spacing={2}>
        <Box w={1.5} h={1.5} borderRadius="full" bg={meta.color} flexShrink={0} />
        <Text fontSize="xs" fontWeight={500} color="ink" noOfLines={1}>
          {formatEventTime(event.startAt).replace(/:00\s/, ' ')} {event.title}
        </Text>
      </HStack>
    </Box>
  )
}

function EventDetail({ event, onClose }) {
  if (!event) return null
  const meta = EVENT_TYPES[event.type]

  return (
    <VStack align="stretch" spacing={6} pt={2}>
      <Box>
        <HStack spacing={2} mb={3}>
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
        </HStack>
        <Heading fontSize="display-md" fontWeight={500} color="ink" mb={3}>
          {event.title}
        </Heading>
        <Text fontSize="sm" color="inkMuted">
          {formatEventDate(event.startAt)}
        </Text>
        <Text fontSize="sm" color="inkMuted">
          {formatEventTime(event.startAt)} - {formatEventTime(event.endAt)}
        </Text>
      </Box>

      <Divider borderColor="line" />

      <Box>
        <Text fontSize="xs" color="inkMuted" letterSpacing="0.06em" textTransform="uppercase" mb={2}>
          Hosted by
        </Text>
        <Text fontSize="md" color="ink" fontWeight={500}>
          {event.host}
        </Text>
      </Box>

      <Box>
        <Text fontSize="xs" color="inkMuted" letterSpacing="0.06em" textTransform="uppercase" mb={2}>
          About this session
        </Text>
        <Text fontSize="sm" color="ink" lineHeight={1.7}>
          {event.description}
        </Text>
      </Box>

      {event.tags?.length > 0 && (
        <Box>
          <Text fontSize="xs" color="inkMuted" letterSpacing="0.06em" textTransform="uppercase" mb={2}>
            Tags
          </Text>
          <HStack spacing={2} flexWrap="wrap">
            {event.tags.map((tag) => (
              <Badge
                key={tag}
                bg="surface"
                color="ink"
                fontWeight={500}
                fontSize="xs"
                px={2.5}
                py={1}
                borderRadius="pill"
              >
                {tag}
              </Badge>
            ))}
          </HStack>
        </Box>
      )}

      {event.joinUrl && (
        <Button
          as="a"
          href={event.joinUrl}
          target="_blank"
          rel="noopener noreferrer"
          leftIcon={<ExternalLink size={16} />}
          size="md"
        >
          Reserve a spot
        </Button>
      )}
    </VStack>
  )
}

export default function CalendarPage() {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedEvent, setSelectedEvent] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const cells = useMemo(() => getMonthGrid(viewYear, viewMonth), [viewYear, viewMonth])
  const monthLabel = useMemo(() => {
    return new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }, [viewYear, viewMonth])

  const handleEventClick = (event) => {
    setSelectedEvent(event)
    onOpen()
  }

  const handlePrev = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1)
      setViewMonth(11)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const handleNext = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1)
      setViewMonth(0)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const handleToday = () => {
    const now = new Date()
    setViewYear(now.getFullYear())
    setViewMonth(now.getMonth())
  }

  return (
    <Flex direction="column" h="full" minH="calc(100vh - 64px)">
      <Flex
        align="center"
        justify="space-between"
        pb={5}
        borderBottom="1px solid"
        borderColor="line"
        mb={5}
      >
        <Box>
          <Text fontSize="xs" color="inkMuted" letterSpacing="0.08em" textTransform="uppercase" mb={1}>
            Academy calendar
          </Text>
          <Heading fontSize="display-md" fontWeight={500} color="ink">
            {monthLabel}
          </Heading>
        </Box>
        <HStack spacing={3}>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <HStack spacing={1}>
            <IconButton
              aria-label="Previous month"
              icon={<ChevronLeft size={18} />}
              variant="ghost"
              size="sm"
              onClick={handlePrev}
            />
            <IconButton
              aria-label="Next month"
              icon={<ChevronRight size={18} />}
              variant="ghost"
              size="sm"
              onClick={handleNext}
            />
          </HStack>
        </HStack>
      </Flex>

      <Box
        border="1px solid"
        borderColor="line"
        borderRadius="card"
        overflow="hidden"
        bg="white"
        flex={1}
      >
        <Flex bg="surface" borderBottom="1px solid" borderColor="line">
          {DAY_NAMES.map((day) => (
            <Box
              key={day}
              flex={1}
              px={3}
              py={3}
              textAlign="left"
              fontSize="xs"
              fontWeight={600}
              color="inkMuted"
              letterSpacing="0.06em"
              textTransform="uppercase"
            >
              {day}
            </Box>
          ))}
        </Flex>

        <Box>
          {Array.from({ length: cells.length / 7 }).map((_, weekIdx) => (
            <Flex key={weekIdx} borderBottom={weekIdx < cells.length / 7 - 1 ? '1px solid' : 'none'} borderColor="line">
              {cells.slice(weekIdx * 7, weekIdx * 7 + 7).map((cell, idx) => {
                const dayEvents = SEED_EVENTS.filter((e) => isSameDay(new Date(e.startAt), cell.date))
                const isToday = isSameDay(cell.date, today)
                return (
                  <Box
                    key={idx}
                    flex={1}
                    minH="120px"
                    p={2}
                    borderRight={idx < 6 ? '1px solid' : 'none'}
                    borderColor="line"
                    bg={cell.inMonth ? 'white' : 'bg'}
                    opacity={cell.inMonth ? 1 : 0.5}
                  >
                    <HStack mb={2} spacing={2}>
                      <Box
                        w={6}
                        h={6}
                        borderRadius="full"
                        bg={isToday ? 'brand.500' : 'transparent'}
                        color={isToday ? 'white' : 'ink'}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="xs"
                        fontWeight={isToday ? 600 : 500}
                      >
                        {cell.date.getDate()}
                      </Box>
                    </HStack>
                    {dayEvents.map((event) => (
                      <EventChip key={event.id} event={event} onClick={handleEventClick} />
                    ))}
                  </Box>
                )
              })}
            </Flex>
          ))}
        </Box>
      </Box>

      <HStack spacing={5} mt={5} flexWrap="wrap">
        {Object.entries(EVENT_TYPES).map(([key, meta]) => (
          <HStack key={key} spacing={2}>
            <Box w={2} h={2} borderRadius="full" bg={meta.color} />
            <Text fontSize="xs" color="inkMuted">
              {meta.label}
            </Text>
          </HStack>
        ))}
      </HStack>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton mt={2} />
          <DrawerBody pt={12} px={8} pb={8}>
            <EventDetail event={selectedEvent} onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  )
}
