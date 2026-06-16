// src/pages/Login.jsx
// Centered card login. J|13 logo at top, two fields (username or email + password),
// one button. Accepts either username or email via signInWithIdentifier.

import { useState } from 'react'
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
import {
  Box, Flex, Container, Text, VStack, FormControl, FormLabel,
  Input, Button, Alert, AlertIcon, Link, Image, HStack
} from '@chakra-ui/react'
import { signInWithIdentifier } from '../lib/auth'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

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
          <VStack spacing={6}>
            <Box w="full" maxW="280px" mx="auto">
              <Image
                src="/j13-logo.png"
                alt="J|13 Dealer Academy"
                w="full"
                h="auto"
              />
            </Box>
            <Text fontSize="sm" color="inkMuted" textAlign="center">
              Member platform for Janda Dealer Training.
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
              <VStack align="stretch" spacing={5}>
                {error && (
                  <Alert status="error" borderRadius="md" fontSize="sm" bg="red.50" color="red.800">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}

                <FormControl isRequired>
                  <FormLabel>Username or email</FormLabel>
                  <Input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="jjanda"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck="false"
                    size="md"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    size="md"
                  />
                </FormControl>

                <Button
                  type="submit"
                  isLoading={loading}
                  loadingText="Signing in"
                  size="md"
                  mt={1}
                >
                  Sign in
                </Button>
              </VStack>
            </form>
          </Box>

          <HStack justify="space-between" fontSize="sm" px={1}>
            <Link as={RouterLink} to="/signup/" color="inkMuted">
              Request access
            </Link>
            <Link href="#" color="inkMuted">
              Forgot password
            </Link>
          </HStack>
        </VStack>
      </Container>
    </Flex>
  )
}
