// src/pages/Roadmap/StepDetail.jsx
// STATUS: active | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Header standardized; Phase 1 checkpoint committed (e765830).
//   2026-08-01  New: Learn / Word Tracks / Practice / Check tabs, 80% gate, commitment flow
// NEXT: Server-side grading + manager sign-off entry point in Phase 2
// One step of the Roadmap. Four movements matching the J13 learning loop:
// Learn, Word Tracks, Practice, Check. The knowledge check gates progression
// (80 percent to pass) and finishes with the next-customer commitment, which
// is the whole point: real application, not video completion.

import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Flex, HStack, VStack, Text, Button, Icon, Radio, RadioGroup, Textarea,
  useToast,
} from '@chakra-ui/react'
import { ArrowLeft, ArrowRight, Check, MessageCircle, Quote } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { getStepBySlug, STEPS } from '../../content/steps'
import { getProgress, startStep, recordAttempt, addCommitment } from '../../lib/progressStore'

const TABS = ['Learn', 'Word Tracks', 'Practice', 'Check']

function SectionCard({ children, ...rest }) {
  return (
    <Box bg="white" border="1px solid" borderColor="line" borderRadius="card" p={5} {...rest}>
      {children}
    </Box>
  )
}

function LearnTab({ step }) {
  return (
    <VStack align="stretch" spacing={4}>
      <SectionCard>
        <Text fontSize="mono-xs" fontFamily="mono" textTransform="uppercase" letterSpacing="0.08em" color="inkDim" mb={2}>
          Purpose
        </Text>
        <Text fontSize="body-lg" lineHeight={1.7}>
          {step.purpose}
        </Text>
      </SectionCard>
      {step.learn.map((section) => (
        <SectionCard key={section.heading}>
          <Text fontWeight={600} mb={2} letterSpacing="-0.01em">
            {section.heading}
          </Text>
          <Text fontSize="body" color="inkMuted" lineHeight={1.75} whiteSpace="pre-wrap">
            {section.body}
          </Text>
        </SectionCard>
      ))}
    </VStack>
  )
}

function WordTracksTab({ step }) {
  return (
    <VStack align="stretch" spacing={3}>
      <Text fontSize="body-sm" color="inkMuted" lineHeight={1.6}>
        These are the approved J13 tracks. Personalize the words, never the sequence or intent.
      </Text>
      {step.wordTracks.map((track, i) => (
        <SectionCard key={i} position="relative">
          <Icon as={Quote} boxSize={4} color="accent.500" mb={2} />
          <Text fontSize="body-lg" lineHeight={1.7} fontStyle="italic" mb={2}>
            {track.text}
          </Text>
          <Text fontSize="mono-xs" fontFamily="mono" textTransform="uppercase" letterSpacing="0.08em" color="inkDim">
            {track.label}
          </Text>
        </SectionCard>
      ))}
    </VStack>
  )
}

function PracticeTab({ step, onCoach }) {
  return (
    <VStack align="stretch" spacing={4}>
      {step.practice.map((lab, i) => (
        <SectionCard key={i}>
          <Text fontWeight={600} mb={2} letterSpacing="-0.01em">
            {lab.title}
          </Text>
          <Text fontSize="body" color="inkMuted" lineHeight={1.75} mb={4} whiteSpace="pre-wrap">
            {lab.instructions}
          </Text>
          <Button size="sm" leftIcon={<MessageCircle size={15} />} onClick={onCoach}>
            Run this with the Coach
          </Button>
        </SectionCard>
      ))}
    </VStack>
  )
}

function CheckTab({ step, userId, onPassed }) {
  const questions = step.knowledgeCheck
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const toast = useToast()

  const allAnswered = questions.every((_, i) => answers[i] != null)

  const submit = () => {
    let score = 0
    questions.forEach((q, i) => {
      if (Number(answers[i]) === q.answerIndex) score += 1
    })
    const { passed } = recordAttempt(userId, step.number, score, questions.length, answers)
    setResult({ score, total: questions.length, passed })
    if (passed) {
      onPassed()
    } else {
      toast({
        title: `${score} of ${questions.length}. You need 80 percent. Review and go again.`,
        status: 'warning',
        duration: 4000,
      })
    }
  }

  if (result?.passed) return null

  return (
    <VStack align="stretch" spacing={4}>
      <Text fontSize="body-sm" color="inkMuted">
        {questions.length} questions. 80 percent passes the step.
      </Text>
      {questions.map((q, i) => (
        <SectionCard key={i}>
          <Text fontWeight={600} mb={3} lineHeight={1.5} letterSpacing="-0.01em">
            {i + 1}. {q.question}
          </Text>
          <RadioGroup value={answers[i] != null ? String(answers[i]) : ''} onChange={(v) => setAnswers((a) => ({ ...a, [i]: Number(v) }))}>
            <VStack align="stretch" spacing={2}>
              {q.options.map((opt, j) => {
                const wrong = result && Number(answers[i]) === j && j !== q.answerIndex
                return (
                  <HStack
                    key={j}
                    as="label"
                    border="1px solid"
                    borderColor={wrong ? 'danger' : Number(answers[i]) === j ? 'ink' : 'line'}
                    borderRadius="input"
                    px={3}
                    py={2.5}
                    cursor="pointer"
                    transition="border-color 120ms"
                    _hover={{ borderColor: 'inkMuted' }}
                  >
                    <Radio value={String(j)} colorScheme="brand" />
                    <Text fontSize="body" lineHeight={1.5}>
                      {opt}
                    </Text>
                  </HStack>
                )
              })}
            </VStack>
          </RadioGroup>
        </SectionCard>
      ))}
      <Button size="lg" isDisabled={!allAnswered} onClick={submit}>
        {result ? 'Try again' : 'Submit check'}
      </Button>
    </VStack>
  )
}

function CommitmentGate({ step, userId, nextStep }) {
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)
  const navigate = useNavigate()

  const save = () => {
    if (text.trim()) addCommitment(userId, step.number, text.trim())
    setSaved(true)
  }

  return (
    <SectionCard borderColor="lineStrong">
      <Flex boxSize="40px" borderRadius="full" bg="ink" color="white" align="center" justify="center" mb={4}>
        <Check size={20} strokeWidth={3} />
      </Flex>
      <Text fontSize="display-sm" fontWeight={600} mb={1} letterSpacing="-0.01em">
        Step {step.number} passed.
      </Text>
      {!saved ? (
        <>
          <Text fontSize="body" color="inkMuted" lineHeight={1.7} mb={4}>
            {step.commitment || 'On my next customer, I will apply this specific behavior:'}
          </Text>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="One specific behavior you will use on your next customer"
            bg="white"
            rows={2}
            mb={4}
          />
          <HStack>
            <Button onClick={save} isDisabled={!text.trim()}>
              Commit
            </Button>
            <Button variant="ghost" onClick={() => setSaved(true)}>
              Skip
            </Button>
          </HStack>
        </>
      ) : (
        <HStack pt={2}>
          {nextStep ? (
            <Button rightIcon={<ArrowRight size={16} />} onClick={() => navigate(`/courses/roadmap/${nextStep.slug}/`)}>
              Next: {nextStep.title}
            </Button>
          ) : (
            <Button onClick={() => navigate('/courses/roadmap/')}>You finished the Roadmap</Button>
          )}
          <Button variant="ghost" onClick={() => navigate('/courses/roadmap/')}>
            Back to Roadmap
          </Button>
        </HStack>
      )}
    </SectionCard>
  )
}

export default function StepDetail() {
  const { slug } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const step = getStepBySlug(slug)
  const [tab, setTab] = useState(0)
  const [justPassed, setJustPassed] = useState(false)

  const progress = useMemo(() => getProgress(user?.id), [user?.id])
  const stepState = step ? progress.steps.find((s) => s.number === step.number) : null

  useEffect(() => {
    if (step && stepState?.unlocked) startStep(user?.id, step.number)
    window.scrollTo(0, 0)
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!step) {
    navigate('/courses/roadmap/', { replace: true })
    return null
  }

  if (stepState && !stepState.unlocked) {
    navigate('/courses/roadmap/', { replace: true })
    return null
  }

  const alreadyPassed = stepState?.passed && !justPassed
  const nextStep = STEPS.find((s) => s.number === step.number + 1) || null

  return (
    <Box maxW="720px" mx="auto">
      <HStack mb={5} spacing={3}>
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={15} />} onClick={() => navigate('/courses/roadmap/')} px={2}>
          Roadmap
        </Button>
      </HStack>

      <Box mb={6}>
        <Text fontSize="mono-xs" fontFamily="mono" textTransform="uppercase" letterSpacing="0.1em" color="accent.500" mb={1}>
          Step {step.number} of 13
        </Text>
        <Text fontSize="display-lg" fontWeight={600} letterSpacing="-0.02em" lineHeight={1.15}>
          {step.title}
        </Text>
      </Box>

      {(justPassed || alreadyPassed) && (
        <Box mb={6}>
          <CommitmentGate step={step} userId={user?.id} nextStep={nextStep} />
        </Box>
      )}

      {/* segmented tabs, horizontally scrollable on small screens */}
      <HStack
        spacing={1}
        mb={6}
        bg="surface"
        borderRadius="pill"
        p={1}
        overflowX="auto"
        css={{ scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
      >
        {TABS.map((label, i) => (
          <Button
            key={label}
            size="sm"
            flexShrink={0}
            flex={{ base: 'none', md: 1 }}
            variant="unstyled"
            display="flex"
            px={4}
            h="34px"
            borderRadius="pill"
            fontSize="body-sm"
            fontWeight={tab === i ? 600 : 500}
            bg={tab === i ? 'white' : 'transparent'}
            color={tab === i ? 'ink' : 'inkMuted'}
            boxShadow={tab === i ? '0 1px 4px rgba(10,10,10,0.08)' : 'none'}
            onClick={() => setTab(i)}
            transition="all 150ms"
          >
            {label}
          </Button>
        ))}
      </HStack>

      {tab === 0 && <LearnTab step={step} />}
      {tab === 1 && <WordTracksTab step={step} />}
      {tab === 2 && <PracticeTab step={step} onCoach={() => navigate('/coach/')} />}
      {tab === 3 && (
        <CheckTab
          step={step}
          userId={user?.id}
          onPassed={() => {
            setJustPassed(true)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      )}
    </Box>
  )
}
