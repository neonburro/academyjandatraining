// src/pages/Admin.jsx
// Admin placeholder for Jazz. Real admin work lives in the separate Pulse repo
// (pulse.jandatraining.com). This page is just here as a route stub.

import { Box, Heading, Text, VStack } from '@chakra-ui/react'

export default function Admin() {
  return (
    <VStack align="stretch" spacing={6} maxW="1200px">
      <Box>
        <Text fontSize="sm" color="inkMuted" mb={1}>
          Admin
        </Text>
        <Heading fontSize="3xl" fontFamily="display" fontWeight={400}>
          Operator Tools
        </Heading>
      </Box>

      <Box bg="white" p={8} borderRadius="lg" border="1px solid" borderColor="line">
        <Text fontSize="sm" color="inkMuted" lineHeight={1.7}>
          Full operator tooling lives at pulse.jandatraining.com. This route is reserved for in-app admin actions like manual user invites and quick content edits.
        </Text>
      </Box>
    </VStack>
  )
}
