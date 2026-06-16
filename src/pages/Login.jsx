// src/pages/Login.jsx
// Login. Logo + DEALER ACADEMY wordmark, placeholder-only fields,
// password visibility toggle. Forgot password opens an inline reset modal.
// "Request access" routes to the marketing site contact form since the
// Academy itself is invite-only.

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box, Flex, Container, Text, VStack, FormControl,
  Input, InputGroup, InputRightElement, IconButton,
  Button, Alert, AlertIcon, Link, Image, HStack,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  FormLabel, useDisclosure
} from '@chakra-ui/react'
import { Eye, EyeOff } from 'lucide-react'
import { signInWithIdentifier, sendPasswordReset } from '../lib/auth'

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
              <Button onClick={handleClose} size="md" mt={2}>
                Done
              </Button>
            </VStack>
          ) : (
            <form onSubmit={handleSubmit}>
              <VStack align="stretch" spacing={4}>
                <Text fontSize="sm" color="inkMuted" lineHeight={1.6}>
                  Enter your account email and we will send you a link to set a new password.
                </Text>
                {error && (
                  <Alert status="error" borderRadius="md" fontSize="sm" bg="red.50" color="red.800">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@dealership.com"
                    autoComplete="email"
                    size="md"
                  />
                </FormControl>
                <Button
                  type="submit"
                  isLoading={sending}
                  loadingText="Sending"
                  size="md"
                  mt={2}
                >
                  Send reset link
                </Button>
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
  const { isOpen, onOpen, onClose } = useDisclosure()

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
            <Text
              fontSize="md"
              fontWeight={600}
              color="inkMuted"
              letterSpacing="0.18em"
              textTransform="uppercase"
            >
              Dealer Academy
            </Text>
          </VStack>

          <Box
            bg="white"
            borderRadius="card"
            border="1px solid"
            borderColor="line"
            p={{ base: 7, md: 8 }}
          >
            <form onSubmit={handleSubmit}>
              <VStack align="stretch" spacing={4}>
                {error && (
                  <Alert status="error" borderRadius="md" fontSize="sm" bg="red.50" color="red.800">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}

                <Input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Username or email"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck="false"
                  size="lg"
                  aria-label="Username or email"
                />

                <InputGroup size="lg">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoComplete="current-password"
                    aria-label="Password"
                    pr="3rem"
                  />
                  <InputRightElement h="full" pr={2}>
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword((v) => !v)}
                      color="inkMuted"
                      _hover={{ color: 'ink', bg: 'transparent' }}
                    />
                  </InputRightElement>
                </InputGroup>

                <Button
                  type="submit"
                  isLoading={loading}
                  loadingText="Signing in"
                  size="md"
                  mt={2}
                >
                  Sign in
                </Button>
              </VStack>
            </form>
          </Box>

          <VStack spacing={5}>
            <HStack justify="space-between" w="full" fontSize="sm" px={1}>
              <Link
                href="https://jandatraining.com/contact/"
                color="inkMuted"
                _hover={{ color: 'ink' }}
              >
                Request access
              </Link>
              <Link
                as="button"
                type="button"
                onClick={onOpen}
                color="inkMuted"
                _hover={{ color: 'ink' }}
              >
                Forgot password
              </Link>
            </HStack>

            <Text fontSize="xs" color="inkDim" textAlign="center" fontStyle="italic">
              Built by Janda Dealer Training.
            </Text>
          </VStack>
        </VStack>
      </Container>
      <ForgotPasswordModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  )
}
