// src/pages/Dashboard/components/CoachCard.jsx
// The AI-vision placeholder. Currently shows a canned encouraging line. This is
// where the adaptive AI coaching will live, personalized daily guidance that
// raises difficulty as the salesperson improves. Labeled honestly as coming.

import { Box, HStack, VStack, Text, Flex, Icon, Badge } from '@chakra-ui/react'
import { Sparkles } from 'lucide-react'

export default function CoachCard({ firstName }) {
  return (
    <Box
      bg="ink"
      color="white"
      borderRadius="cardLg"
      p={6}
      position="relative"
      overflow="hidden"
    >
      <HStack spacing={3} mb={4}>
        <Flex w={8} h={8} borderRadius="full" bg="whiteAlpha.200" align="center" justify="center">
          <Icon as={Sparkles} boxSize={4} color="white" />
        </Flex>
        <Text fontSize="xs" fontWeight={600} letterSpacing="0.08em" textTransform="uppercase" color="whiteAlpha.800">
          Your coach
        </Text>
        <Badge bg="accent.500" color="white" fontWeight={500} fontSize="10px" px={2} py={0.5} borderRadius="pill" textTransform="uppercase" letterSpacing="0.06em">
          Coming soon
        </Badge>
      </HStack>
      <Text fontSize="md" lineHeight={1.6} color="whiteAlpha.900" maxW="52ch">
        {firstName ? `${firstName}, ` : ''}your daily coaching will live here. As you complete lessons and quizzes, the Academy learns where you are strong and where to push, and builds each day's plan around it.
      </Text>
    </Box>
  )
}