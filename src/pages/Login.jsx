// src/pages/Login.jsx
// STATUS: active | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  AFIP Industry Member 2026 badge added below the sign-in card,
//               per Jazz (industry affiliate, approved to display). Image
//               hides itself if the asset is missing so nothing ever looks
//               broken. Header standardized; checkpoint e765830.
// Login. Logo + DEALER ACADEMY wordmark, placeholder-only fields,
// password visibility toggle. Forgot password opens an inline reset modal.
//
// (2026-07-21) "Request access" now opens an inline modal that posts to the
// request-access Netlify function (stores in access_requests + emails Jazz
// and JJ), instead of linking to an external route that 404'd. The Academy
// is invite-only, so this is a request for Jazz to grant access manually.

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box, Flex, Container, Text, VStack, FormControl,
  Input, InputGroup, InputRightElement, IconButton,
  Button, Alert, AlertIcon, Link, Image, HStack, Select,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  FormLabel, useDisclosure
} from '@chakra-ui/react'
import { Eye, EyeOff } from 'lucide-react'
import { signInWithIdentifier, sendPasswordReset } from '../lib/auth'

const ROLES = ['Dealer Principal / Owner', 'General Manager', 'Sales Manager', 'Finance Manager', 'Fixed Ops Manager', 'Salesperson', 'Other']

function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSending(true)
    const { error: resetError } = await sendPasswordReset(email)
    setSending(false)
    if (resetError) {
      setError(resetError.message)
      return
    }
    setSent(true)
  }

  const handleClose = () => {
    setEmail('')
    setSent(false)
    setError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay bg="blackAlpha.500" />
      <ModalContent borderRadius="card" mx={6}>
        <ModalHeader fontSize="lg" fontWeight={600} pt={6}>
          Reset your password
        </ModalHeader>
        <ModalCloseButton mt={2} />
        <ModalBody pb={8}>
          {sent ? (
            <VStack align="stretch" spacing={4}>
              <Text fontSize="sm" color="ink" lineHeight={1.6}>
                If an account exists for that email, we have sent a reset link. Check your inbox and follow the instructions.
              </Text>
              <Button onClick={handleClose} size="md" mt={2}>Done</Button>
            </VStack>
          ) : (
            <form onSubmit={handleSubmit}>
              <VStack align="stretch" spacing={4}>
                <Text fontSize="sm" color="inkMuted" lineHeight={1.6}>
                  Enter your account email and we will send you a link to set a new password.
                </Text>
                {error && (
                  <Alert status="error" borderRadius="md" fontSize="sm" bg="red.50" color="red.800">
                    <AlertIcon />{error}
                  </Alert>
                )}
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@dealership.com" autoComplete="email" size="md" />
                </FormControl>
                <Button type="submit" isLoading={sending} loadingText="Sending" size="md" mt={2}>Send reset link</Button>
              </VStack>
            </form>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

function RequestAccessModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ name: '', dealership: '', email: '', role: '' })
  const [botField, setBotField] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSending(true)
    try {
      const res = await fetch('/.netlify/functions/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, 'bot-field': botField }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setSent(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const handleClose = () => {
    setForm({ name: '', dealership: '', email: '', role: '' })
    setBotField('')
    setSent(false)
    setError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay bg="blackAlpha.500" />
      <ModalContent borderRadius="card" mx={6}>
        <ModalHeader fontSize="lg" fontWeight={600} pt={6}>
          Request access
        </ModalHeader>
        <ModalCloseButton mt={2} />
        <ModalBody pb={8}>
          {sent ? (
            <VStack align="stretch" spacing={4}>
              <Text fontSize="sm" color="ink" lineHeight={1.6}>
                Thanks. Your request is in. Jazz will review it and be in touch about getting your team set up, usually within one business day.
              </Text>
              <Button onClick={handleClose} size="md" mt={2}>Done</Button>
            </VStack>
          ) : (
            <form onSubmit={handleSubmit}>
              <VStack align="stretch" spacing={4}>
                <Text fontSize="sm" color="inkMuted" lineHeight={1.6}>
                  The Academy is invite-only. Tell us about your store and Jazz will get you set up.
                </Text>
                {error && (
                  <Alert status="error" borderRadius="md" fontSize="sm" bg="red.50" color="red.800">
                    <AlertIcon />{error}
                  </Alert>
                )}
                {/* honeypot */}
                <Box display="none" aria-hidden="true">
                  <Input tabIndex={-1} autoComplete="off" value={botField} onChange={(e) => setBotField(e.target.value)} />
                </Box>
                <FormControl isRequired>
                  <FormLabel>Your name</FormLabel>
                  <Input value={form.name} onChange={setField('name')} placeholder="Jane Smith" autoComplete="name" size="md" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Dealership</FormLabel>
                  <Input value={form.dealership} onChange={setField('dealership')} placeholder="Smith Powersports" autoComplete="organization" size="md" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" value={form.email} onChange={setField('email')} placeholder="jane@smithpowersports.com" autoComplete="email" size="md" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Role</FormLabel>
                  <Select value={form.role} onChange={setField('role')} placeholder="Select a role" size="md">
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </Select>
                </FormControl>
                <Button type="submit" isLoading={sending} loadingText="Sending" size="md" mt={2}>Send request</Button>
              </VStack>
            </form>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const forgot = useDisclosure()
  const request = useDisclosure()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: signInError } = await signInWithIdentifier(identifier, password)
    setLoading(false)
    if (signInError) {
      setError(signInError.message)
      return
    }
    const from = location.state?.from?.pathname || '/dashboard/'
    navigate(from, { replace: true })
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="bg" px={6} py={12}>
      <Container maxW="420px" px={0}>
        <VStack align="stretch" spacing={8}>
          <VStack spacing={4}>
            <Box w="full" maxW="240px" mx="auto">
              <Image src="/j13-logo.png" alt="J|13" w="full" h="auto" />
            </Box>
            <Text fontSize="md" fontWeight={600} color="inkMuted" letterSpacing="0.18em" textTransform="uppercase">
              Dealer Academy
            </Text>
          </VStack>

          <Box bg="white" borderRadius="card" border="1px solid" borderColor="line" p={{ base: 7, md: 8 }}>
            <form onSubmit={handleSubmit}>
              <VStack align="stretch" spacing={4}>
                {error && (
                  <Alert status="error" borderRadius="md" fontSize="sm" bg="red.50" color="red.800">
                    <AlertIcon />{error}
                  </Alert>
                )}
                <Input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Username or email" autoComplete="username" autoCapitalize="none" spellCheck="false" size="lg" aria-label="Username or email" />
                <InputGroup size="lg">
                  <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoComplete="current-password" aria-label="Password" pr="3rem" />
                  <InputRightElement h="full" pr={2}>
                    <IconButton aria-label={showPassword ? 'Hide password' : 'Show password'} icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />} variant="ghost" size="sm" onClick={() => setShowPassword((v) => !v)} color="inkMuted" _hover={{ color: 'ink', bg: 'transparent' }} />
                  </InputRightElement>
                </InputGroup>
                <Button type="submit" isLoading={loading} loadingText="Signing in" size="md" mt={2}>Sign in</Button>
              </VStack>
            </form>
          </Box>

          <VStack spacing={5}>
            <HStack justify="space-between" w="full" fontSize="sm" px={1}>
              <Link as="button" type="button" onClick={request.onOpen} color="inkMuted" _hover={{ color: 'ink' }}>
                Request access
              </Link>
              <Link as="button" type="button" onClick={forgot.onOpen} color="inkMuted" _hover={{ color: 'ink' }}>
                Forgot password
              </Link>
            </HStack>
            <VStack spacing={2}>
              <Image
                src="/afip-industry-member-2026.png"
                alt="AFIP Industry Member 2026"
                boxSize="64px"
                objectFit="contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              <Text fontSize="xs" color="inkDim" textAlign="center" letterSpacing="0.02em">
                AFIP Industry Member 2026
              </Text>
            </VStack>
            <Text fontSize="xs" color="inkDim" textAlign="center" fontStyle="italic">
              Built by Janda Dealer Training.
            </Text>
          </VStack>
        </VStack>
      </Container>
      <ForgotPasswordModal isOpen={forgot.isOpen} onClose={forgot.onClose} />
      <RequestAccessModal isOpen={request.isOpen} onClose={request.onClose} />
    </Flex>
  )
}