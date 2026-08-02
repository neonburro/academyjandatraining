// src/pages/Settings/components/SectionCard.jsx
// STATUS: stable | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Header standardized; Phase 1 checkpoint committed (e765830).
// Shared shell for a settings section: title, optional description, body.

import { Box, VStack, Heading, Text } from '@chakra-ui/react'

export default function SectionCard({ title, description, children }) {
  return (
    <Box bg="white" borderRadius="card" border="1px solid" borderColor="line" p={{ base: 6, md: 7 }}>
      <VStack align="stretch" spacing={5}>
        <Box>
          <Heading fontSize="display-sm" fontWeight={600} color="ink">
            {title}
          </Heading>
          {description && (
            <Text fontSize="sm" color="inkMuted" mt={1.5} lineHeight={1.6}>
              {description}
            </Text>
          )}
        </Box>
        {children}
      </VStack>
    </Box>
  )
}