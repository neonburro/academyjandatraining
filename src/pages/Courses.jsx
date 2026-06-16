// src/pages/Courses.jsx
// Course library placeholder. Will list published courses grouped by department.

import { Box, Heading, Text, VStack } from '@chakra-ui/react'

export default function Courses() {
  return (
    <VStack align="stretch" spacing={6} maxW="1200px">
      <Box>
        <Text fontSize="sm" color="inkMuted" mb={1}>
          Library
        </Text>
        <Heading fontSize="3xl" fontFamily="display" fontWeight={400}>
          Courses
        </Heading>
      </Box>

      <Box bg="white" p={8} borderRadius="lg" border="1px solid" borderColor="line">
        <Text fontSize="sm" color="inkMuted" lineHeight={1.7}>
          Course library lands in the next build cycle. Sales, F&I, Service, Parts and Management modules ship as Jazz produces them.
        </Text>
      </Box>
    </VStack>
  )
}
