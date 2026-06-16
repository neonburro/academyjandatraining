// src/pages/Signup.jsx
// Signup placeholder. Real signup is gated by invite from Jazz's admin,
// not open public registration. This page shows that messaging.

import { Box, Container, Heading, Text, VStack, Button, Link } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export default function Signup() {
  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="bg" px={6}>
      <Container maxW="md">
        <VStack align="stretch" spacing={6} bg="white" p={{ base: 8, md: 10 }} borderRadius="lg" border="1px solid" borderColor="line">
          <Text fontFamily="display" fontSize="2xl" lineHeight={1} color="ink">
            Request an account
          </Text>
          <Text fontSize="sm" color="inkMuted" lineHeight={1.6}>
            J|13 Dealer Academy is an invite-only platform for dealerships working with Jazz Janda. Reach out to your Janda contact to be added to your dealership account.
          </Text>
          <Text fontSize="sm" color="inkMuted">
            Already have an account?
          </Text>
          <Button as={RouterLink} to="/login/" variant="outline" w="full">
            Sign in
          </Button>
        </VStack>
      </Container>
    </Box>
  )
}
