// src/pages/Dashboard/components/AdminNudge.jsx
// STATUS: active | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Rewritten: the old copy claimed the plan was placeholder,
//               which is no longer true. Now points at the live launch
//               checklist in the Command center.
// Admins only (Jazz, Tyler). Quiet pointer to the remaining launch work.

import { Box, HStack, Text, Button } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export default function AdminNudge() {
  return (
    <Box bg="surface" borderRadius="card" p={6} border="1px solid" borderColor="line">
      <HStack justify="space-between" flexDir={{ base: 'column', sm: 'row' }} align={{ base: 'stretch', sm: 'center' }} spacing={4}>
        <Box>
          <Text fontSize="sm" fontWeight={600} color="ink" mb={1}>
            You are seeing the live member experience.
          </Text>
          <Text fontSize="sm" color="inkMuted" lineHeight={1.6} maxW="60ch">
            The curriculum, checks and coach are running on real content from the 2026 manuals. The Command center tracks the last switches to flip.
          </Text>
        </Box>
        <Button as={RouterLink} to="/admin/" size="md" flexShrink={0}>
          Command center
        </Button>
      </HStack>
    </Box>
  )
}
