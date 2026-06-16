// src/pages/Insights.jsx
// Smart suggestions surface + Academy AI chat. Both are placeholders for now.
// The chat UI is fully rendered but the input is disabled and submission goes
// nowhere. Frames the future product clearly.

import {
  Box, Heading, Text, VStack, HStack, Button, Icon, Badge, Flex, Input, IconButton, Tooltip
} from '@chakra-ui/react'
import { Sparkles, TrendingDown, BookOpen, MessageSquare, Send, Lock } from 'lucide-react'

function SuggestionCard({ severity, kpi, change, suggestion, course }) {
  const severityColor = severity === 'high' ? 'danger' : severity === 'medium' ? 'warn' : 'inkMuted'
  return (
    <Box
      bg="white"
      p={5}
      borderRadius="card"
      border="1px solid"
      borderColor="line"
      _hover={{ borderColor: 'lineStrong' }}
      transition="border-color 150ms"
    >
      <HStack mb={3} spacing={3}>
        <Icon as={TrendingDown} boxSize={4} color={severityColor} />
        <Text fontSize="xs" fontWeight={600} color={severityColor} letterSpacing="0.06em" textTransform="uppercase">
          {kpi}
        </Text>
        <Text fontSize="xs" color="inkMuted">
          {change}
        </Text>
      </HStack>
      <Text fontSize="sm" color="ink" mb={4} lineHeight={1.6}>
        {suggestion}
      </Text>
      <HStack spacing={3}>
        <Button leftIcon={<BookOpen size={14} />} size="sm" variant="outline">
          {course}
        </Button>
        <Button size="sm" variant="ghost" color="inkMuted">
          Dismiss
        </Button>
      </HStack>
    </Box>
  )
}

function ChatMessage({ role, content }) {
  const isUser = role === 'user'
  return (
    <Flex justify={isUser ? 'flex-end' : 'flex-start'} mb={3}>
      <Box
        maxW="80%"
        px={4}
        py={3}
        bg={isUser ? 'brand.500' : 'surface'}
        color={isUser ? 'white' : 'ink'}
        borderRadius="cardLg"
        borderTopRightRadius={isUser ? '4px' : 'cardLg'}
        borderTopLeftRadius={isUser ? 'cardLg' : '4px'}
      >
        <Text fontSize="sm" lineHeight={1.6}>
          {content}
        </Text>
      </Box>
    </Flex>
  )
}

export default function Insights() {
  return (
    <VStack align="stretch" spacing={10} maxW="1200px">
      <Box>
        <Text fontSize="xs" color="inkMuted" letterSpacing="0.08em" textTransform="uppercase" mb={2}>
          Insights
        </Text>
        <Heading fontSize="display-lg" fontWeight={500} color="ink">
          What to work on next.
        </Heading>
        <Text fontSize="md" color="inkMuted" mt={2}>
          Suggestions based on your team's progress and KPIs. Ask Academy AI anything Jazz would know.
        </Text>
      </Box>

      <Box>
        <HStack mb={4}>
          <Icon as={Sparkles} boxSize={4} color="brand.500" />
          <Heading fontSize="display-sm" fontWeight={600} color="ink">
            Smart suggestions
          </Heading>
          <Badge bg="surface" color="inkMuted" fontWeight={500} fontSize="xs" px={2} py={0.5} borderRadius="pill">
            Preview
          </Badge>
        </HStack>
        <VStack align="stretch" spacing={3}>
          <SuggestionCard
            severity="high"
            kpi="F&I PVR"
            change="Down 18% MoM"
            suggestion="Your F&I PVR dropped 18% last month. The Titanium Trade-In Objections lesson directly targets the deal types that hurt PVR the most."
            course="Watch lesson (12 min)"
          />
          <SuggestionCard
            severity="medium"
            kpi="Service conversion"
            change="Down 7% MoM"
            suggestion="Service conversion is sliding. Assign your team the Service Talk Tracks lesson to tighten up the handoff from the write-up to the close."
            course="Assign to service team"
          />
          <SuggestionCard
            severity="low"
            kpi="Course completion"
            change="3 reps behind"
            suggestion="Three sales reps haven't completed this month's assigned lesson. A quick reminder usually moves the needle."
            course="Send reminder"
          />
        </VStack>
        <Text fontSize="xs" color="inkDim" fontStyle="italic" mt={4}>
          These are example suggestions. Real KPI-driven suggestions activate once your team starts logging numbers.
        </Text>
      </Box>

      <Box>
        <HStack mb={4}>
          <Icon as={MessageSquare} boxSize={4} color="brand.500" />
          <Heading fontSize="display-sm" fontWeight={600} color="ink">
            Academy AI
          </Heading>
          <Badge bg="brand.50" color="brand.500" fontWeight={600} fontSize="xs" px={2} py={0.5} borderRadius="pill">
            <HStack spacing={1}>
              <Lock size={10} />
              <Text>In training</Text>
            </HStack>
          </Badge>
        </HStack>

        <Box
          bg="white"
          borderRadius="cardLg"
          border="1px solid"
          borderColor="line"
          overflow="hidden"
        >
          <Box p={6} bg="surface" borderBottom="1px solid" borderColor="line">
            <Text fontSize="sm" fontWeight={600} color="ink" mb={1}>
              Ask Academy AI
            </Text>
            <Text fontSize="xs" color="inkMuted" lineHeight={1.5}>
              Trained on Jazz's training library. Get answers, objection talk tracks, and lesson recommendations.
            </Text>
          </Box>

          <Box p={6} minH="280px" position="relative">
            <ChatMessage
              role="assistant"
              content="Hey! I'm Academy AI. Once Jazz finishes loading his training library, I'll be able to answer questions like 'how do I handle a titanium trade-in objection?' or 'what should I tell a buyer who's only focused on monthly payment?' For now, I'm in training."
            />
            <ChatMessage
              role="user"
              content="When will you be ready?"
            />
            <ChatMessage
              role="assistant"
              content="As soon as Jazz uploads his first batch of lessons. Stick around. The longer he trains me, the better I get."
            />
          </Box>

          <Box
            p={4}
            borderTop="1px solid"
            borderColor="line"
            position="relative"
          >
            <HStack spacing={3}>
              <Input
                placeholder="Academy AI is in training. Available next cycle."
                size="md"
                isDisabled
                bg="surface"
                _placeholder={{ color: 'inkDim', fontStyle: 'italic' }}
              />
              <Tooltip label="Available next cycle" hasArrow>
                <IconButton
                  aria-label="Send message"
                  icon={<Send size={16} />}
                  isDisabled
                  size="md"
                />
              </Tooltip>
            </HStack>
          </Box>
        </Box>

        <Text fontSize="xs" color="inkDim" fontStyle="italic" mt={4}>
          Powered by Jazz's training library and frontier AI. Your conversations stay private to your dealership.
        </Text>
      </Box>

      <Box bg="surface" p={6} borderRadius="card">
        <Text fontSize="xs" color="inkMuted" letterSpacing="0.08em" textTransform="uppercase" mb={2}>
          Coming next cycle
        </Text>
        <Text fontSize="sm" color="ink" lineHeight={1.7}>
          Live AI chat trained on Jazz's lessons. Smart suggestions that adapt to your real KPI history. Auto-generated weekly training plans based on what your team needs.
        </Text>
      </Box>
    </VStack>
  )
}
