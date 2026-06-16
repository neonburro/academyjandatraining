// src/pages/ResetPassword.jsx
// Where users land from the password reset email link. Supabase's SDK
// auto-detects the recovery token in the URL hash and treats the user as
// temporarily authenticated for one password change.
//
// UI matches the login page: placeholder-only fields, eye icon on both
// password inputs, brand wordmark at top, quiet signature at bottom.

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Flex, Container, Text, VStack,
  Input, InputGroup, InputRightElement, IconButton,
  Button, Alert, AlertIcon, Image
} from '@chakra-ui/react'
import { Eye, EyeOff } from 'lucide-react'
import { updatePassword, onAuthStateChange } from '../lib/auth'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setReady(true)
      }
    })
    const timer = setTimeout(() => setReady(true), 1500)
    return () => {
      subscription.unsubscribe()
      clearTimeout(timer)
    }
  }, [])

  const passwordsMatch = password.length > 0 && confirm.length > 0 && password === confirm
  const passwordsConflict = password.length > 0 && confirm.length > 0 && password !== confirm

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { error: updateError } = await updatePassword(password)
    setLoading(false)

    if (updateError) {
      setError(
        updateError.message?.includes('expired')
          ? 'This reset link has expired. Request a new one from the login page.'
          : updateError.message || 'Could not update password. The reset link may have expired.'
      )
      return
    }
    setSuccess(true)
    setTimeout(() => navigate('/dashboard/', { replace: true }), 1500)
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
            {success ? (
              <VStack align="stretch" spacing={4}>
                <Alert status="success" borderRadius="md" fontSize="sm">
                  <AlertIcon />
                  Password updated. Redirecting to your dashboard.
                </Alert>
              </VStack>
            ) : (
              <form onSubmit={handleSubmit}>
                <VStack align="stretch" spacing={4}>
                  <Text fontSize="sm" color="inkMuted" lineHeight={1.6}>
                    Set a new password. At least 8 characters.
                  </Text>

                  {error && (
                    <Alert status="error" borderRadius="md" fontSize="sm" bg="red.50" color="red.800">
                      <AlertIcon />
                      {error}
                    </Alert>
                  )}

                  <InputGroup size="lg">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="New password"
                      autoComplete="new-password"
                      aria-label="New password"
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

                  <InputGroup size="lg">
                    <Input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      aria-label="Confirm new password"
                      pr="3rem"
                      borderColor={
                        passwordsConflict
                          ? 'danger'
                          : passwordsMatch
                          ? 'success'
                          : 'lineStrong'
                      }
                      _hover={{
                        borderColor: passwordsConflict
                          ? 'danger'
                          : passwordsMatch
                          ? 'success'
                          : 'inkMuted',
                      }}
                    />
                    <InputRightElement h="full" pr={2}>
                      <IconButton
                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                        icon={showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirm((v) => !v)}
                        color="inkMuted"
                        _hover={{ color: 'ink', bg: 'transparent' }}
                      />
                    </InputRightElement>
                  </InputGroup>

                  {passwordsConflict && (
                    <Text fontSize="xs" color="danger" mt={-2}>
                      Passwords do not match yet.
                    </Text>
                  )}

                  <Button
                    type="submit"
                    isLoading={loading}
                    loadingText="Updating"
                    isDisabled={!ready || !passwordsMatch || password.length < 8}
                    size="md"
                    mt={2}
                  >
                    {ready ? 'Update password' : 'Loading...'}
                  </Button>
                </VStack>
              </form>
            )}
          </Box>

          <Text fontSize="xs" color="inkDim" textAlign="center" fontStyle="italic">
            Built by Janda Dealer Training.
          </Text>
        </VStack>
      </Container>
    </Flex>
  )
}
