// src/pages/Dashboard/components/UpNext.jsx
// A peek at the coming days so the training feels like a curriculum with rhythm.

import { Box, HStack, VStack, Heading, Text, Divider } from '@chakra-ui/react'

export default function UpNext({ items }) {
  return (
    <Box>
      <Heading fontSize="display-sm" fontWeight={600} color="ink" mb={4}>
        Up next
      </Heading>
      <Box bg="white" borderRadius="card" border="1px solid" borderColor="line" overflow="hidden">
        {items.map((item, i) => (
          <Box key={item.day}>
            {i > 0 && <Divider borderColor="line" />}
            <HStack px={5} py={3.5} spacing={4}>
              <Text fontSize="xs" fontWeight={600} color="inkMuted" letterSpacing="0.06em" textTransform="uppercase" w="80px" flexShrink={0}>
                {item.day}
              </Text>
              <Text fontSize="sm" color="ink">
                {item.label}
              </Text>
            </HStack>
          </Box>
        ))}
      </Box>
    </Box>
  )
}