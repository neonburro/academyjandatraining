// src/components/layout/AppShell.jsx
// Outer shell for all authenticated routes. Sidebar + main content area.

import { Outlet } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function AppShell() {
  return (
    <Flex minH="100vh" bg="bg">
      <Box display={{ base: 'none', lg: 'block' }}>
        <Sidebar />
      </Box>
      <Flex direction="column" flex={1} minW={0}>
        <Header />
        <Box as="main" flex={1} p={{ base: 6, lg: 10 }}>
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  )
}
