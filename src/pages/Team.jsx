// src/pages/Team.jsx
// STATUS: active | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Rewritten from placeholder stats to a live roster. Reads real
//               users and step_progress from Supabase under RLS: members see
//               teammates, managers and admins additionally see progress.
// NEXT: Manager sign-off actions per member (Phase 3)
// The team board. Every row is a real person from the database with their
// real position on the Roadmap. No fake zeros anywhere.

import { useEffect, useState } from 'react'
import {
  Box, Flex, HStack, VStack, Text, Icon, Spinner, Progress, Badge,
} from '@chakra-ui/react'
import { Users } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { STEPS } from '../content/steps'

const ROLE_LABELS = {
  admin: 'Admin',
  owner: 'Dealer Admin',
  manager: 'Manager',
  employee: 'Member',
}

function MemberRow({ member }) {
  const name = member.display_name || member.first_name || member.email
  const initial = (name || '?')[0].toUpperCase()
  const pct = Math.round(((member.passedCount || 0) / STEPS.length) * 100)

  return (
    <HStack bg="white" border="1px solid" borderColor="line" borderRadius="card" p={4} spacing={4}>
      <Flex boxSize="40px" borderRadius="full" bg="ink" color="white" align="center" justify="center" fontWeight={600} flexShrink={0}>
        {initial}
      </Flex>
      <Box flex={1} minW={0}>
        <HStack spacing={2}>
          <Text fontWeight={600} noOfLines={1} letterSpacing="-0.01em">
            {name}
          </Text>
          {member.role && (
            <Badge bg="surface" color="inkMuted" fontWeight={500} fontSize="10px" px={2} py={0.5} borderRadius="pill" textTransform="uppercase" letterSpacing="0.06em">
              {ROLE_LABELS[member.role] || member.role}
            </Badge>
          )}
        </HStack>
        {member.hasProgress ? (
          <HStack spacing={3} mt={1.5}>
            <Progress
              value={pct}
              size="xs"
              flex={1}
              maxW="220px"
              borderRadius="full"
              bg="surface2"
              sx={{ '& > div': { background: 'var(--chakra-colors-ink)' } }}
            />
            <Text fontSize="mono-xs" fontFamily="mono" color="inkMuted" flexShrink={0}>
              {member.passedCount}/{STEPS.length}
            </Text>
          </HStack>
        ) : (
          <Text fontSize="xs" color="inkDim" mt={1}>
            {member.email}
          </Text>
        )}
      </Box>
    </HStack>
  )
}

export default function Team() {
  const [state, setState] = useState({ loading: true, members: [], canSeeProgress: false })

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 6000))
        const { data: users, error } = await Promise.race([
          supabase.from('users').select('*').order('email'),
          timeout,
        ])
        if (error || !users) throw error || new Error('no data')

        const { data: progressRows } = await supabase
          .from('step_progress')
          .select('user_id, status')

        const passedByUser = {}
        for (const row of progressRows || []) {
          if (row.status === 'check_passed' || row.status === 'signed_off') {
            passedByUser[row.user_id] = (passedByUser[row.user_id] || 0) + 1
          }
        }
        const canSeeProgress = (progressRows || []).length > 0

        const members = users.map((u) => ({
          ...u,
          passedCount: passedByUser[u.id] || 0,
          hasProgress: canSeeProgress,
        }))
        if (mounted) setState({ loading: false, members, canSeeProgress })
      } catch {
        if (mounted) setState({ loading: false, members: [], canSeeProgress: false })
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <VStack align="stretch" spacing={6} maxW="760px" mx="auto">
      <Box>
        <Text fontSize="sm" color="inkMuted" mb={1}>
          Your dealership
        </Text>
        <Text fontSize="display-md" fontWeight={600} letterSpacing="-0.02em">
          Team
        </Text>
      </Box>

      {state.loading ? (
        <Flex justify="center" py={16}>
          <Spinner size="lg" color="ink" thickness="3px" />
        </Flex>
      ) : state.members.length > 0 ? (
        <VStack align="stretch" spacing={3}>
          {state.members.map((m) => (
            <MemberRow key={m.id} member={m} />
          ))}
        </VStack>
      ) : (
        <Box bg="white" border="1px dashed" borderColor="lineStrong" borderRadius="cardLg" p={{ base: 8, md: 12 }} textAlign="center">
          <Flex boxSize="52px" borderRadius="full" bg="surface" align="center" justify="center" mx="auto" mb={4}>
            <Icon as={Users} boxSize={5} color="inkMuted" />
          </Flex>
          <Text fontWeight={600} mb={2} letterSpacing="-0.01em">
            Your team shows up here.
          </Text>
          <Text fontSize="body-sm" color="inkMuted" maxW="380px" mx="auto" lineHeight={1.7}>
            As members of your dealership join the Academy, every person appears on this board with their real position on the Roadmap. Managers see progress; members see teammates.
          </Text>
        </Box>
      )}

      <Box bg="surface" p={5} borderRadius="card">
        <Text fontSize="body-sm" color="inkMuted" lineHeight={1.7}>
          Phase 3 adds the manager tools here: role-play sign-offs, assignments and the daily process audit from the Trainer Edition.
        </Text>
      </Box>
    </VStack>
  )
}
