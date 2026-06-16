// src/components/layout/Sidebar.jsx
// Left sidebar nav for the Academy app shell.
// Shows brand at top, then navigation by department area.

import { NavLink, useLocation } from 'react-router-dom'
import { Box, VStack, HStack, Text, Icon } from '@chakra-ui/react'
import { LayoutDashboard, BookOpen, Settings, Shield } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const NAV_ITEMS = [
  { to: '/dashboard/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/courses/', label: 'Courses', icon: BookOpen },
]

const ADMIN_ITEMS = [
  { to: '/admin/', label: 'Admin', icon: Shield },
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
        bg={isActive ? 'surface' : 'transparent'}
        color={isActive ? 'ink' : 'inkMuted'}
        _hover={{ bg: 'surface', color: 'ink' }}
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
          <Text fontFamily="display" fontSize="xl" lineHeight={1} color="ink">
            J|13 Dealer
          </Text>
          <Text fontFamily="display" fontSize="xl" lineHeight={1} color="ink">
            Academy
          </Text>
        </Box>

        <VStack align="stretch" spacing={1}>
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </VStack>

        {isAdmin && (
          <Box>
            <Text fontSize="xs" fontWeight={600} color="inkDim" px={4} mb={2} letterSpacing="0.05em">
              ADMIN
            </Text>
            <VStack align="stretch" spacing={1}>
              {ADMIN_ITEMS.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  )
}
