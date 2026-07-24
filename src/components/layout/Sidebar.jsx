// src/components/layout/Sidebar.jsx
// Left sidebar nav. Logo at top, four daily items: Today, Courses, Calendar,
// Team. Insights folded into the dashboard AI coach. Clean black active state.
//
// Admin (2026-07-23): rendered only when the user has the admin role, and set
// below a divider with its own small label. It is a different kind of
// destination than the four daily items, so it reads as a separate group
// rather than a fifth tab. This mirrors the mobile More sheet, where Admin
// also sits below a divider.
//
// Hiding the item is cosmetic. Real protection lives in ProtectedRoute and in
// Supabase RLS policies.
//
// Settings and Sign out intentionally live in the Header avatar menu, not
// here, so there is exactly one place to find account actions on desktop.

import { NavLink, useLocation } from 'react-router-dom'
import { Box, VStack, HStack, Text, Icon, Image } from '@chakra-ui/react'
import { LayoutDashboard, BookOpen, Calendar, Users, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const NAV_ITEMS = [
  { to: '/dashboard/', label: 'Today', icon: LayoutDashboard },
  { to: '/courses/', label: 'Courses', icon: BookOpen },
  { to: '/calendar/', label: 'Calendar', icon: Calendar },
  { to: '/team/', label: 'Team', icon: Users },
]

function NavItem({ to, label, icon: IconComponent }) {
  const location = useLocation()
  const isActive = location.pathname.startsWith(to)
  return (
    <NavLink to={to} style={{ textDecoration: 'none', width: '100%' }}>
      <HStack
        px={4}
        py={2.5}
        borderRadius="md"
        bg={isActive ? 'ink' : 'transparent'}
        color={isActive ? 'white' : 'inkMuted'}
        _hover={{ bg: isActive ? 'ink' : 'surface', color: isActive ? 'white' : 'ink' }}
        transition="all 150ms"
        spacing={3}
      >
        <Icon as={IconComponent} boxSize={4} />
        <Text fontSize="sm" fontWeight={isActive ? 600 : 500}>
          {label}
        </Text>
      </HStack>
    </NavLink>
  )
}

export default function Sidebar() {
  const { isAdmin } = useAuth()

  return (
    <Box
      as="aside"
      w={{ base: 'full', lg: '240px' }}
      minH="100vh"
      bg="white"
      borderRight="1px solid"
      borderColor="line"
      px={4}
      py={6}
      position={{ base: 'relative', lg: 'sticky' }}
      top={0}
    >
      <VStack align="stretch" spacing={8}>
        <Box px={2}>
          <Image src="/j13-logo.png" alt="J13 Dealer Academy" w="150px" h="auto" />
        </Box>

        <VStack align="stretch" spacing={1}>
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </VStack>

        {/* Admin group. Only exists for admins. */}
        {isAdmin && (
          <VStack align="stretch" spacing={1}>
            <Box h="1px" bg="line" mb={2} aria-hidden="true" />
            <Text
              px={4}
              pb={1}
              fontSize="10px"
              fontWeight={600}
              letterSpacing="0.12em"
              textTransform="uppercase"
              color="inkDim"
            >
              Manage
            </Text>
            <NavItem to="/admin/" label="Admin" icon={ShieldCheck} />
          </VStack>
        )}
      </VStack>
    </Box>
  )
}