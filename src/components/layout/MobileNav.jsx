// src/components/layout/MobileNav.jsx
// Fixed bottom nav for mobile. Mirrors the sidebar language so mobile and
// desktop use the same words: Today, Training, Coach. The fourth slot is
// More, which opens a bottom sheet (Calendar, Team, Settings, Admin, Log out).
//
// Breakpoint matches Sidebar exactly: sidebar shows at lg and up, this shows
// below lg. One breakpoint, never both at once.
//
// Admin is CONDITIONALLY RENDERED, not disabled. A user without the admin role
// never sees it exist. Note that hiding a nav item is cosmetic only: the real
// protection has to live in ProtectedRoute and in Supabase RLS.
//
// signOut is imported from lib/auth, matching Header, so both surfaces use the
// same sign out path.
//
// Safe area: pb uses env(safe-area-inset-bottom) so the bar clears the iPhone
// home indicator instead of sitting under it.

import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Box, HStack, VStack, Text, Icon,
  Drawer, DrawerOverlay, DrawerContent, DrawerBody,
  useDisclosure,
} from '@chakra-ui/react'
import {
  LayoutDashboard, Map, Sparkles, Calendar, MoreHorizontal,
  Users, Settings, ShieldCheck, LogOut,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { signOut } from '../../lib/auth'

const NAV_ITEMS = [
  { to: '/dashboard/', label: 'Today', icon: LayoutDashboard },
  { to: '/courses/', label: 'Training', icon: Map },
  { to: '/coach/', label: 'Coach', icon: Sparkles },
]

function ActiveTick({ show }) {
  return (
    <Box
      position="absolute"
      top={0}
      left="50%"
      transform="translateX(-50%)"
      w={show ? '18px' : '0'}
      h="2px"
      bg="ink"
      borderRadius="full"
      transition="width 200ms"
      aria-hidden="true"
    />
  )
}

function TabItem({ to, label, icon: IconComponent }) {
  const location = useLocation()
  const isActive = location.pathname.startsWith(to)
  return (
    <NavLink to={to} style={{ textDecoration: 'none', flex: 1 }}>
      <VStack
        spacing={1}
        py={2}
        color={isActive ? 'ink' : 'inkDim'}
        transition="color 150ms"
        position="relative"
      >
        <ActiveTick show={isActive} />
        <Icon as={IconComponent} boxSize={5} strokeWidth={isActive ? 2.4 : 2} />
        <Text fontSize="11px" fontWeight={isActive ? 600 : 500} letterSpacing="-0.01em">
          {label}
        </Text>
      </VStack>
    </NavLink>
  )
}

function SheetRow({ icon: IconComponent, label, onClick, danger = false }) {
  return (
    <HStack
      as="button"
      onClick={onClick}
      w="full"
      px={5}
      py={4}
      spacing={4}
      textAlign="left"
      color={danger ? 'danger' : 'ink'}
      _hover={{ bg: 'surface' }}
      _active={{ bg: 'surface' }}
      transition="background 120ms"
      borderRadius="md"
    >
      <Icon as={IconComponent} boxSize={5} color={danger ? 'danger' : 'inkMuted'} />
      <Text fontSize="md" fontWeight={500}>
        {label}
      </Text>
    </HStack>
  )
}

export default function MobileNav() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAdmin } = useAuth()

  const moreIsActive =
    location.pathname.startsWith('/calendar/') ||
    location.pathname.startsWith('/team/') ||
    location.pathname.startsWith('/settings/') ||
    location.pathname.startsWith('/admin/')

  const go = (path) => {
    onClose()
    navigate(path)
  }

  const handleSignOut = async () => {
    onClose()
    await signOut()
    navigate('/login/', { replace: true })
  }

  return (
    <>
      <Box
        as="nav"
        aria-label="Main navigation"
        display={{ base: 'block', lg: 'none' }}
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        zIndex={40}
        bg="white"
        borderTop="1px solid"
        borderColor="line"
        pb="env(safe-area-inset-bottom)"
      >
        <HStack spacing={0} align="stretch">
          {NAV_ITEMS.map((item) => (
            <TabItem key={item.to} {...item} />
          ))}

          {/* More: opens the sheet, does not navigate */}
          <VStack
            as="button"
            onClick={onOpen}
            aria-label="More"
            flex={1}
            spacing={1}
            py={2}
            color={moreIsActive ? 'ink' : 'inkDim'}
            transition="color 150ms"
            position="relative"
          >
            <ActiveTick show={moreIsActive} />
            <Icon as={MoreHorizontal} boxSize={5} strokeWidth={moreIsActive ? 2.4 : 2} />
            <Text fontSize="11px" fontWeight={moreIsActive ? 600 : 500} letterSpacing="-0.01em">
              More
            </Text>
          </VStack>
        </HStack>
      </Box>

      <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
        <DrawerOverlay bg="blackAlpha.500" />
        <DrawerContent
          bg="white"
          borderTopRadius="2xl"
          pb="calc(env(safe-area-inset-bottom) + 1rem)"
        >
          <DrawerBody px={3} pt={3} pb={0}>
            {/* grab handle */}
            <Box
              w="36px"
              h="4px"
              bg="line"
              borderRadius="full"
              mx="auto"
              mb={3}
              aria-hidden="true"
            />
            <VStack align="stretch" spacing={0}>
              <SheetRow icon={Calendar} label="Calendar" onClick={() => go('/calendar/')} />
              <SheetRow icon={Users} label="Team" onClick={() => go('/team/')} />
              <SheetRow icon={Settings} label="Settings" onClick={() => go('/settings/')} />

              {/* Admin only exists for admins. Not greyed out, absent. */}
              {isAdmin && (
                <SheetRow icon={ShieldCheck} label="Admin" onClick={() => go('/admin/')} />
              )}

              <Box h="1px" bg="line" my={2} aria-hidden="true" />

              <SheetRow icon={LogOut} label="Log out" onClick={handleSignOut} danger />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}