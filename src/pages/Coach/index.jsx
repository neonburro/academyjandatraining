// src/pages/Coach/index.jsx
// The J13 Coach chat. Full-height conversation surface, mobile-first. Talks to
// the coach Netlify function (real Anthropic API) with the user's live
// training context so the coach keeps them on task. Transcript persists
// locally per user.

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Box, Flex, VStack, HStack, Text, Textarea, IconButton, Spinner,
  Wrap, WrapItem, Button, useToast,
} from '@chakra-ui/react'
import { ArrowUp, RotateCcw, Sparkles } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { getProgress } from '../../lib/progressStore'
import { sendToCoach, loadTranscript, saveTranscript, clearTranscript } from '../../lib/coachApi'

const SUGGESTIONS = [
  'Quiz me on my current step',
  'Role-play a customer with me',
  'Run the objection loop on "I need to think about it"',
  'What should I work on today?',
]

function Bubble({ message }) {
  const isUser = message.role === 'user'
  return (
    <HStack align="flex-start" justify={isUser ? 'flex-end' : 'flex-start'} w="full" spacing={3}>
      {!isUser && (
        <Flex
          boxSize="30px"
          borderRadius="full"
          bg="ink"
          color="white"
          align="center"
          justify="center"
          flexShrink={0}
          mt={1}
        >
          <Sparkles size={14} />
        </Flex>
      )}
      <Box
        maxW="82%"
        bg={isUser ? 'ink' : 'white'}
        color={isUser ? 'white' : 'ink'}
        border={isUser ? 'none' : '1px solid'}
        borderColor="line"
        px={4}
        py={2.5}
        borderRadius="18px"
        borderTopLeftRadius={isUser ? '18px' : '6px'}
        borderTopRightRadius={isUser ? '6px' : '18px'}
      >
        <Text fontSize="body" lineHeight={1.6} whiteSpace="pre-wrap">
          {message.content}
        </Text>
      </Box>
    </HStack>
  )
}

export default function Coach() {
  const { user, profile } = useAuth()
  const toast = useToast()
  const userId = user?.id
  const firstName = profile?.first_name || profile?.display_name || 'there'

  const [messages, setMessages] = useState(() => loadTranscript(userId))
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  const progress = useMemo(() => getProgress(userId), [userId])

  const context = useMemo(
    () => ({
      firstName,
      role: profile?.role || null,
      currentStep: progress.currentStep
        ? {
            number: progress.currentStep.number,
            title: progress.currentStep.title,
            status: progress.currentStep.status,
          }
        : null,
      streakDays: progress.streakDays,
      openCommitments: progress.openCommitments.map((c) => c.body),
    }),
    [firstName, profile?.role, progress]
  )

  useEffect(() => {
    setMessages(loadTranscript(userId))
  }, [userId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  const send = async (text) => {
    const trimmed = (text || '').trim()
    if (!trimmed || sending) return
    const next = [...messages, { role: 'user', content: trimmed }]
    setMessages(next)
    saveTranscript(userId, next)
    setInput('')
    setSending(true)
    try {
      const { reply } = await sendToCoach(next, context)
      const withReply = [...next, { role: 'assistant', content: reply }]
      setMessages(withReply)
      saveTranscript(userId, withReply)
    } catch {
      toast({
        title: 'The coach did not answer. Check your connection and try again.',
        status: 'error',
        duration: 4000,
      })
    } finally {
      setSending(false)
    }
  }

  const reset = () => {
    clearTranscript(userId)
    setMessages([])
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <Flex
      direction="column"
      maxW="760px"
      mx="auto"
      h={{
        base: 'calc(100dvh - 64px - 3rem - 6rem - env(safe-area-inset-bottom))',
        lg: 'calc(100vh - 64px - 5rem)',
      }}
      minH="420px"
    >
      <HStack justify="space-between" pb={4} flexShrink={0}>
        <Box>
          <Text fontSize="sm" color="inkMuted">
            Your corner guy
          </Text>
          <Text fontSize="display-md" fontWeight={600} letterSpacing="-0.02em">
            Coach
          </Text>
        </Box>
        {messages.length > 0 && (
          <IconButton
            aria-label="Start over"
            icon={<RotateCcw size={16} />}
            variant="ghost"
            size="sm"
            onClick={reset}
          />
        )}
      </HStack>

      <VStack
        flex={1}
        overflowY="auto"
        align="stretch"
        spacing={4}
        pb={4}
        css={{ scrollbarWidth: 'thin' }}
      >
        {messages.length === 0 && (
          <Box pt={6}>
            <Flex
              boxSize="44px"
              borderRadius="full"
              bg="ink"
              color="white"
              align="center"
              justify="center"
              mb={4}
            >
              <Sparkles size={20} />
            </Flex>
            <Text fontSize="lead" fontWeight={600} mb={1}>
              {`Ready when you are, ${firstName}.`}
            </Text>
            <Text fontSize="body-sm" color="inkMuted" mb={5} lineHeight={1.6}>
              {progress.currentStep
                ? `You're on Step ${progress.currentStep.number}, ${progress.currentStep.title}. I can quiz you, run role-play or talk through your next customer.`
                : 'I can quiz you, run role-play on any of the 13 steps or talk through your next customer.'}
            </Text>
            <Wrap spacing={2}>
              {SUGGESTIONS.map((s) => (
                <WrapItem key={s}>
                  <Button size="sm" variant="outline" borderRadius="pill" fontWeight={500} onClick={() => send(s)}>
                    {s}
                  </Button>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        )}

        {messages.map((m, i) => (
          <Bubble key={i} message={m} />
        ))}

        {sending && (
          <HStack spacing={3}>
            <Flex boxSize="30px" borderRadius="full" bg="ink" color="white" align="center" justify="center">
              <Sparkles size={14} />
            </Flex>
            <Spinner size="sm" color="inkDim" speed="0.8s" />
          </HStack>
        )}
        <Box ref={bottomRef} />
      </VStack>

      <HStack
        flexShrink={0}
        bg="white"
        border="1px solid"
        borderColor="lineStrong"
        borderRadius="24px"
        p={2}
        pl={4}
        align="flex-end"
        spacing={2}
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask the coach anything"
          variant="unstyled"
          rows={1}
          resize="none"
          maxH="120px"
          fontSize="body"
          py={2}
        />
        <IconButton
          aria-label="Send"
          icon={<ArrowUp size={18} />}
          borderRadius="full"
          isDisabled={!input.trim() || sending}
          onClick={() => send(input)}
        />
      </HStack>
    </Flex>
  )
}
