// src/components/layout/Header.jsx
// STATUS: stable | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Header standardized; Phase 1 checkpoint committed (e765830).
//   2026-07-23  Avatar menu owns Settings + Sign out on desktop
// Top header bar. Avatar menu (top right): Account settings + Sign out.
// Uses display_name and initials from the profile. Black avatar.

import { useNavigate } from 'react-router-dom'
import { HStack, Box, Text, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Avatar, Button } from '@chakra-ui/react'
import { LogOut, Settings as SettingsIcon } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { signOut } from '../../lib/auth'

export default function Header() {
  const navigate = useNavigate()
  const { user, profile, dealership } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login/', { replace: true })
  }

  const displayName = profile?.display_name || profile?.full_name || user?.email?.split('@')[0] || 'User'
  const initials = profile?.initials || displayName.slice(0, 2).toUpperCase()
  const contextLabel = dealership?.name || (profile?.role === 'admin' ? 'Platform admin' : '')

  return (
    <Box
      as="header"
      h="64px"
      px={6}
      borderBottom="1px solid"
      borderColor="line"
      bg="white"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Text fontSize="sm" color="inkMuted">
        {contextLabel}
      </Text>

      <Menu>
        <MenuButton as={Button} variant="ghost" px={2} py={1} h="auto" borderRadius="pill" _hover={{ bg: 'surface' }}>
          <HStack spacing={3}>
            <Avatar size="sm" name={displayName} getInitials={() => initials} bg="ink" color="white" />
            <Box textAlign="left">
              <Text fontSize="sm" fontWeight={500} color="ink" lineHeight={1.2}>
                {displayName}
              </Text>
              {profile?.role && (
                <Text fontSize="xs" color="inkMuted" textTransform="capitalize">
                  {profile.role}
                </Text>
              )}
            </Box>
          </HStack>
        </MenuButton>
        <MenuList>
          <MenuItem icon={<SettingsIcon size={16} />} onClick={() => navigate('/settings/')}>
            Account settings
          </MenuItem>
          <MenuDivider />
          <MenuItem icon={<LogOut size={16} />} onClick={handleSignOut}>
            Sign out
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  )
}