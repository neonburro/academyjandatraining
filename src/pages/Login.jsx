// src/pages/Login.jsx
// Email + password login page. Redirects to /dashboard/ on success.

import { useState } from 'react'
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
import {
  Box, Container, Heading, Text, VStack, FormControl, FormLabel,
  Input, Button, Alert, AlertIcon, Link, HStack
} from '@chakra-ui/react'
import { signInWithPassword } from '../lib/auth'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: signInError } = await signInWithPassword(email, password)
    setLoading(false)
    if (signInError) {
      setError(signInError.message)
      return
    }
    const from = location.state?.from?.pathname || '/dashboard/'
    navigate(from, { replace: true })
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="bg" px={6}>
      <Container maxW="md">
        <VStack align="stretch" spacing={8} bg="white" p={{ base: 8, md: 10 }} borderRadius="lg" border="1px solid" borderColor="line">
          <VStack align="stretch" spacing={2}>
            <Text fontFamily="display" fontSize="2xl" lineHeight={1} color="ink">
              J|13 Dealer Academy
            </Text>
            <Text fontSize="sm" color="inkMuted">
              Sign in to your dealership account.
            </Text>
          </VStack>

          <form onSubmit={handleSubmit}>
            <VStack align="stretch" spacing={4}>
              {error && (
                <Alert status="error" borderRadius="md" fontSize="sm">
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              <FormControl isRequired>
                <FormLabel fontSize="sm">Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@dealership.com"
                  autoComplete="email"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm">Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </FormControl>

              <Button type="submit" isLoading={loading} loadingText="Signing in" w="full" mt={2}>
                Sign in
              </Button>
            </VStack>
          </form>

          <HStack justify="space-between" fontSize="sm">
            <Link as={RouterLink} to="/signup/" color="brand.500">
              Need an account?
            </Link>
            <Text color="inkMuted">Forgot password</Text>
          </HStack>
        </VStack>
      </Container>
    </Box>
  )
}
