// src/pages/Dashboard/components/GreetingHeader.jsx
// Time-aware greeting with the salesperson's first name and initials avatar.
// "Good morning / afternoon / evening, Tyler." Sets the day's intention line.

import { Box, HStack, VStack, Heading, Text, Flex } from '@chakra-ui/react'

function greetingForHour(h) {
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function GreetingHeader({ firstName, initials, role, planCount, minutes }) {
  const greeting = greetingForHour(new Date().getHours())
  return (
    <HStack align="center" spacing={5}>
      <Flex
        w={14}
        h={14}
        borderRadius="full"
        bg="ink"
        color="white"
        align="center"
        justify="center"
        fontWeight={600}
        fontSize="lg"
        letterSpacing="0.02em"
        flexShrink={0}
      >
        {initials || (firstName ? firstName[0] : 'T')}
      </Flex>
      <VStack align="stretch" spacing={1}>
        <Text fontSize="xs" color="inkMuted" letterSpacing="0.08em" textTransform="uppercase">
          Today
          {role ? <Text as="span" color="inkDim"> &middot; {role}</Text> : null}
        </Text>
        <Heading fontSize="display-lg" fontWeight={500} color="ink" lineHeight={1.1}>
          {greeting}, {firstName || 'there'}.
        </Heading>
        <Text fontSize="sm" color="inkMuted" mt={1}>
          {planCount} {planCount === 1 ? 'thing' : 'things'} today. About {minutes} minutes.
        </Text>
      </VStack>
    </HStack>
  )
}