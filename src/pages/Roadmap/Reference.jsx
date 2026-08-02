// src/pages/Roadmap/Reference.jsx
// STATUS: active | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  New: quick reference surfacing the Objection Loop and closing
//               techniques from the 2026 Salesperson Workbook.
// The floor companion. The J13 Objection Loop with real objection/response
// pairs and the six closing techniques, verbatim from the master workbook.
// Built for a salesperson to open between customers.

import { useNavigate } from 'react-router-dom'
import { Box, Flex, HStack, VStack, Text, Button, Icon } from '@chakra-ui/react'
import { ArrowLeft, ArrowRight, MessageCircle, Quote } from 'lucide-react'
import { OBJECTION_LOOP, CLOSING_TECHNIQUES } from '../../content/steps'

function Card({ children, ...rest }) {
  return (
    <Box bg="white" border="1px solid" borderColor="line" borderRadius="card" p={5} {...rest}>
      {children}
    </Box>
  )
}

export default function Reference() {
  const navigate = useNavigate()

  return (
    <Box maxW="720px" mx="auto">
      <HStack mb={5}>
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={15} />} onClick={() => navigate('/courses/')} px={2}>
          Training
        </Button>
      </HStack>

      <Box mb={8}>
        <Text fontSize="mono-xs" fontFamily="mono" textTransform="uppercase" letterSpacing="0.1em" color="accent.500" mb={1}>
          Quick reference
        </Text>
        <Text fontSize="display-lg" fontWeight={600} letterSpacing="-0.02em" lineHeight={1.15}>
          The Objection Loop
        </Text>
      </Box>

      {/* the five-step sequence */}
      <HStack
        spacing={2}
        mb={5}
        overflowX="auto"
        pb={1}
        css={{ scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
      >
        {OBJECTION_LOOP.sequence.map((word, i) => (
          <HStack key={word} spacing={2} flexShrink={0}>
            <Box bg="ink" color="white" px={3.5} py={1.5} borderRadius="pill" fontSize="body-sm" fontWeight={600}>
              {word}
            </Box>
            {i < OBJECTION_LOOP.sequence.length - 1 && <Icon as={ArrowRight} boxSize={3.5} color="inkDim" />}
          </HStack>
        ))}
      </HStack>

      <Card mb={8}>
        <Text fontSize="body" color="inkMuted" lineHeight={1.75}>
          {OBJECTION_LOOP.description}
        </Text>
      </Card>

      <VStack align="stretch" spacing={3} mb={10}>
        {OBJECTION_LOOP.examples.map((ex, i) => (
          <Card key={i}>
            <Text fontSize="mono-xs" fontFamily="mono" textTransform="uppercase" letterSpacing="0.08em" color="inkDim" mb={1.5}>
              When they say
            </Text>
            <Text fontWeight={600} mb={3} letterSpacing="-0.01em">
              "{ex.objection}"
            </Text>
            <Text fontSize="mono-xs" fontFamily="mono" textTransform="uppercase" letterSpacing="0.08em" color="accent.500" mb={1.5}>
              The J13 response
            </Text>
            <Text fontSize="body" color="inkMuted" lineHeight={1.7} fontStyle="italic">
              {ex.response}
            </Text>
          </Card>
        ))}
      </VStack>

      <Box mb={5}>
        <Text fontSize="display-md" fontWeight={600} letterSpacing="-0.02em">
          Closing techniques
        </Text>
        <Text fontSize="body-sm" color="inkMuted" mt={1}>
          Six professional ways to ask for the business, from the master workbook.
        </Text>
      </Box>

      <VStack align="stretch" spacing={3} mb={10}>
        {CLOSING_TECHNIQUES.map((t) => (
          <Card key={t.name}>
            <Text fontWeight={600} mb={1.5} letterSpacing="-0.01em">
              {t.name}
            </Text>
            <Text fontSize="body-sm" color="inkMuted" lineHeight={1.65} mb={3}>
              {t.description}
            </Text>
            {t.example && (
              <HStack align="flex-start" spacing={2}>
                <Icon as={Quote} boxSize={3.5} color="accent.500" mt={1} flexShrink={0} />
                <Text fontSize="body" lineHeight={1.65} fontStyle="italic">
                  {t.example}
                </Text>
              </HStack>
            )}
          </Card>
        ))}
      </VStack>

      <Flex bg="ink" color="white" borderRadius="cardLg" p={6} align="center" justify="space-between" gap={4} flexWrap="wrap">
        <Box>
          <Text fontWeight={600} mb={1}>
            Want reps on these?
          </Text>
          <Text fontSize="body-sm" color="whiteAlpha.800">
            The Coach will play the customer and throw these objections at you.
          </Text>
        </Box>
        <Button
          bg="white"
          color="ink"
          size="sm"
          flexShrink={0}
          _hover={{ bg: 'whiteAlpha.900' }}
          leftIcon={<MessageCircle size={15} />}
          onClick={() => navigate('/coach/')}
        >
          Practice now
        </Button>
      </Flex>
    </Box>
  )
}
