// src/components/layout/Header.jsx
// Top header bar inside the app shell. Shows current user + sign out.

import { useNavigate } from 'react-router-dom'
import { HStack, Box, Text, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Avatar, Button } from '@chakra-ui/react'
import { LogOut, User } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { signOut } from '../../lib/auth'

export default function Header() {
  const navigate = useNavigate()
  const { user, profile, dealership } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login/', { replace: true })
  }

  const displayName = profile?.full_name || user?.email || 'User'
  const dealershipName = dealership?.name || 'No dealership'

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
        {dealershipName}
      </Text>

      <Menu>
        <MenuButton as={Button} variant="ghost" px={2} py={1} h="auto">
          <HStack spacing={3}>
            <Avatar size="sm" name={displayName} bg="brand.500" color="white" />
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
          <MenuItem icon={<User size={16} />}>Profile</MenuItem>
          <MenuDivider />
          <MenuItem icon={<LogOut size={16} />} onClick={handleSignOut}>
            Sign out
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  )
}
