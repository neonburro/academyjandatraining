// src/pages/Dashboard/components/AdminNudge.jsx
// Admins only (Jazz, Tyler). A quiet path to the next real job: setting up the
// academy content. Salespeople never see this.

import { Box, HStack, VStack, Text, Button } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export default function AdminNudge() {
  return (
    <Box bg="surface" borderRadius="card" p={6} border="1px solid" borderColor="line">
      <HStack justify="space-between" flexDir={{ base: 'column', sm: 'row' }} align={{ base: 'stretch', sm: 'center' }} spacing={4}>
        <Box>
          <Text fontSize="sm" fontWeight={600} color="ink" mb={1}>
            You are viewing the salesperson preview.
          </Text>
          <Text fontSize="sm" color="inkMuted" lineHeight={1.6} maxW="60ch">
            This is what your team will see each day. The plan is placeholder until courses are added. Head to the admin area to build the real curriculum.
          </Text>
        </Box>
        <Button as={RouterLink} to="/admin/" size="md" flexShrink={0}>
          Set up the academy
        </Button>
      </HStack>
    </Box>
  )
}