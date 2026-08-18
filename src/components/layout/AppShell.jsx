// src/components/layout/AppShell.jsx
// STATUS: active | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Subtle footer added: AFIP Industry Member 2026 badge + line,
//               per Jazz (industry affiliate, approved to display). Image
//               hides itself if the asset is missing so a deploy never shows
//               a broken image. Header standardized (e765830).
// Outer shell for all authenticated routes. Sidebar on desktop, fixed bottom
// nav on mobile, main content area between them.
//
// The mobile bottom bar is position: fixed, so the main content gets extra
// bottom padding below lg. Without it the bar covers the last chunk of every
// page and users cannot scroll past it.

import { Outlet } from 'react-router-dom'
import { Box, Flex, HStack, Text, Image } from '@chakra-ui/react'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileNav from './MobileNav'

function Footer() {
  return (
    <HStack
      as="footer"
      justify="center"
      spacing={2.5}
      pt={2}
      pb={{ base: 'calc(6rem + env(safe-area-inset-bottom))', lg: 8 }}
      px={6}
      opacity={0.75}
    >
      <Image
        src="/afip-industry-member-2026.png"
        alt="AFIP Industry Member 2026"
        boxSize="30px"
        objectFit="contain"
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
      <Text fontSize="mono-xs" fontFamily="mono" color="inkDim" letterSpacing="0.04em">
        Janda Dealer Training · AFIP Industry Member 2026
      </Text>
    </HStack>
  )
}

export default function AppShell() {
  return (
    <Flex minH="100vh" bg="bg">
      <Box display={{ base: 'none', lg: 'block' }}>
        <Sidebar />
      </Box>

      <Flex direction="column" flex={1} minW={0}>
        <Header />
        <Box as="main" flex={1} p={{ base: 6, lg: 10 }} pb={{ base: 6, lg: 6 }}>
          <Outlet />
        </Box>
        <Footer />
      </Flex>

      <MobileNav />
    </Flex>
  )
}
