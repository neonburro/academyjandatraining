// src/pages/ResetPassword.jsx
// STATUS: stable | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Header standardized; Phase 1 checkpoint committed (e765830).
//   2026-07-23  Verify recovery session before enabling submit
// Where users land from the password reset email link.
//
// FIX (2026-07-23): the old version set `ready = true` on an unconditional
// 1500ms timeout, so the Update button enabled whether or not a recovery
// session actually existed. Users then submitted into a void and got the raw
// Supabase error "Auth session missing!" with no idea what to do.
//
// Now the page resolves into one of three explicit states:
//   checking  -> still looking for a session
//   ready     -> a real recovery session exists, form is usable
//   invalid   -> no session, so show a plain-language explanation and a
//                path back to request a fresh link. The form is not shown.
//
// Session detection is belt and braces: supabase detectSessionInUrl fires
// PASSWORD_RECOVERY / SIGNED_IN, and we also call getCurrentSession() directly
// in case the event fired before this component mounted. If a token_hash is
// present in the query string (the newer Supabase recovery flow) we redeem it
// explicitly with verifyOtp, which survives redirects better than URL hashes.
//
// UI matches the login page: placeholder-only fields, eye icon on both
// password inputs, brand wordmark at top, quiet signature at bottom.

import { useState, useEffect } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Box, Flex, Container, Text, VStack,
  Input, InputGroup, InputRightElement, IconButton,
  Button, Alert, AlertIcon, Image, Spinner, Link
} from '@chakra-ui/react'
import { Eye, EyeOff } from 'lucide-react'
import { updatePassword, onAuthStateChange, getCurrentSession } from '../lib/auth'
import { supabase } from '../lib/supabase'

const STATE = { CHECKING: 'checking', READY: 'ready', INVALID: 'invalid' }

export default function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [status, setStatus] = useState(STATE.CHECKING)

  useEffect(() => {
    let settled = false
    let timer = null

    const markReady = () => {
      if (settled) return
      settled = true
      if (timer) clearTimeout(timer)
      setStatus(STATE.READY)
    }

    const markInvalid = () => {
      if (settled) return
      settled = true
      if (timer) clearTimeout(timer)
      setStatus(STATE.INVALID)
    }

    // 1. Listen for the SDK detecting the recovery token in the URL.
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') && session) {
        markReady()
      }
    })

    // 2. Also resolve directly, in case the event fired before mount, or in
    //    case the link used the newer token_hash query param flow.
    const resolve = async () => {
      const existing = await getCurrentSession()
      if (existing) {
        markReady()
        return
      }

      // Newer Supabase recovery links carry ?token_hash=...&type=recovery
      const params = new URLSearchParams(window.location.search)
      const tokenHash = params.get('token_hash')
      const type = params.get('type')

      if (tokenHash && type) {
        const { data, error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type,
        })
        if (data?.session && !verifyError) {
          markReady()
          return
        }
      }

      // Give detectSessionInUrl a moment to finish parsing the hash, then give up.
      timer = setTimeout(async () => {
        const late = await getCurrentSession()
        if (late) {
          markReady()
        } else {
          markInvalid()
        }
      }, 2500)
    }

    resolve()

    return () => {
      subscription.unsubscribe()
      if (timer) clearTimeout(timer)
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

    // Re-check the session immediately before writing, so a session that
    // expired while the form sat open produces a clear message.
    const session = await getCurrentSession()
    if (!session) {
      setStatus(STATE.INVALID)
      return
    }

    setLoading(true)
    const { error: updateError } = await updatePassword(password)
    setLoading(false)

    if (updateError) {
      const msg = updateError.message || ''
      if (msg.toLowerCase().includes('session')) {
        setStatus(STATE.INVALID)
        return
      }
      setError(
        msg.includes('expired')
          ? 'This reset link has expired. Request a new one from the login page.'
          : msg || 'Could not update password. Please request a new reset link.'
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
            {status === STATE.CHECKING ? (
              <VStack spacing={4} py={4}>
                <Spinner size="md" color="inkMuted" thickness="2px" />
                <Text fontSize="sm" color="inkMuted">
                  Checking your reset link.
                </Text>
              </VStack>
            ) : status === STATE.INVALID ? (
              <VStack align="stretch" spacing={5}>
                <Text fontSize="sm" fontWeight={600} color="ink">
                  This reset link is no longer valid.
                </Text>
                <Text fontSize="sm" color="inkMuted" lineHeight={1.6}>
                  Reset links work once and expire after one hour. This one was already
                  used, has expired, or was opened in a different browser than the one
                  that requested it.
                </Text>
                <Text fontSize="sm" color="inkMuted" lineHeight={1.6}>
                  Request a new link from the login page. Open it in the same browser,
                  and if your email app previews links, copy the link and paste it into
                  your browser instead of tapping it.
                </Text>
                <Button as={RouterLink} to="/login/" size="md">
                  Back to login
                </Button>
              </VStack>
            ) : success ? (
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
                    isDisabled={!passwordsMatch || password.length < 8}
                    size="md"
                    mt={2}
                  >
                    Update password
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