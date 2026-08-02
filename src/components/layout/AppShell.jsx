// src/components/layout/AppShell.jsx
// STATUS: stable | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Header standardized; Phase 1 checkpoint committed (e765830).
// Outer shell for all authenticated routes. Sidebar on desktop, fixed bottom
// nav on mobile, main content area between them.
//
// The mobile bottom bar is position: fixed, so the main content gets extra
// bottom padding below lg. Without it the bar covers the last chunk of every
// page and users cannot scroll past it.

import { Outlet } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileNav from './MobileNav'

export default function AppShell() {
  return (
    <Flex minH="100vh" bg="bg">
      <Box display={{ base: 'none', lg: 'block' }}>
        <Sidebar />
      </Box>

      <Flex direction="column" flex={1} minW={0}>
        <Header />
        <Box
          as="main"
          flex={1}
          p={{ base: 6, lg: 10 }}
          pb={{ base: 'calc(6rem + env(safe-area-inset-bottom))', lg: 10 }}
        >
          <Outlet />
        </Box>
      </Flex>

      <MobileNav />
    </Flex>
  )
}