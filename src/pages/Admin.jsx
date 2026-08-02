// src/pages/Admin.jsx
// STATUS: active | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Rebuilt from stub into the operator command center: launch
//               checklist with the real remaining setup steps, dashboard
//               links and the Phase 2 preview. Route now actually exists in
//               App.jsx behind requireAdmin.
// NEXT: Live status checks (migrations applied, coach key present) in Phase 2
// Operator command center for Jazz and Tyler. Honest about what is done and
// what is left to flip on. Deep operator tooling still lives in Pulse.

import { Box, Flex, HStack, VStack, Text, Icon, Link, Button } from '@chakra-ui/react'
import { Check, Circle, Database, KeyRound, Users, ExternalLink, ClipboardList } from 'lucide-react'

const CHECKLIST = [
  {
    done: true,
    title: 'Curriculum installed',
    detail: 'All 13 steps, 78 word tracks and 52 knowledge checks extracted from the 2026 master manuals.',
  },
  {
    done: true,
    title: 'AI coach wired',
    detail: 'The coach function is deployed and grounded in the J13 method.',
  },
  {
    done: false,
    icon: Database,
    title: 'Run migrations 0003 and 0004',
    detail: 'Paste supabase/migrations/0003 then 0004 into the SQL editor. Progress then syncs to the database automatically.',
    href: 'https://supabase.com/dashboard/project/fiowfatqsqagehngburd/sql/new',
    action: 'Open SQL editor',
  },
  {
    done: false,
    icon: KeyRound,
    title: 'Add ANTHROPIC_API_KEY',
    detail: 'Netlify site settings, environment variables. The coach answers with a setup note until this exists.',
    href: 'https://app.netlify.com/projects/j13dealeracademy/settings/env',
    action: 'Open Netlify env',
  },
  {
    done: false,
    icon: Users,
    title: 'Invite the first team',
    detail: 'Manager visibility, sign-offs and team rosters arrive in Phase 2 once the migrations are live.',
  },
]

function ChecklistRow({ item }) {
  return (
    <HStack
      align="flex-start"
      spacing={4}
      bg="white"
      border="1px solid"
      borderColor="line"
      borderRadius="card"
      p={5}
      opacity={item.done ? 0.65 : 1}
    >
      <Flex
        boxSize="30px"
        borderRadius="full"
        bg={item.done ? 'ink' : 'surface'}
        color={item.done ? 'white' : 'inkMuted'}
        align="center"
        justify="center"
        flexShrink={0}
        mt={0.5}
      >
        <Icon as={item.done ? Check : item.icon || Circle} boxSize={item.done ? 4 : 3.5} strokeWidth={item.done ? 3 : 2} />
      </Flex>
      <Box flex={1}>
        <Text fontWeight={600} letterSpacing="-0.01em" textDecoration={item.done ? 'line-through' : 'none'}>
          {item.title}
        </Text>
        <Text fontSize="body-sm" color="inkMuted" lineHeight={1.6} mt={1}>
          {item.detail}
        </Text>
        {item.href && (
          <Button
            as={Link}
            href={item.href}
            isExternal
            size="xs"
            variant="outline"
            mt={3}
            rightIcon={<ExternalLink size={12} />}
            _hover={{ textDecoration: 'none', bg: 'surface' }}
          >
            {item.action}
          </Button>
        )}
      </Box>
    </HStack>
  )
}

export default function Admin() {
  return (
    <VStack align="stretch" spacing={6} maxW="760px" mx="auto">
      <Box>
        <Text fontSize="sm" color="inkMuted" mb={1}>
          Operator
        </Text>
        <Text fontSize="display-md" fontWeight={600} letterSpacing="-0.02em">
          Command center
        </Text>
      </Box>

      <Box>
        <Text fontSize="mono-xs" fontFamily="mono" textTransform="uppercase" letterSpacing="0.1em" color="inkDim" mb={3}>
          Launch checklist
        </Text>
        <VStack align="stretch" spacing={3}>
          {CHECKLIST.map((item) => (
            <ChecklistRow key={item.title} item={item} />
          ))}
        </VStack>
      </Box>

      <HStack
        bg="surface"
        borderRadius="card"
        p={5}
        spacing={4}
        align="flex-start"
      >
        <Icon as={ClipboardList} boxSize={4} color="inkMuted" mt={0.5} flexShrink={0} />
        <Text fontSize="body-sm" color="inkMuted" lineHeight={1.7}>
          Phase 2 lands here next: the team roster with per-step status, knowledge check scores, open commitments and role-play sign-offs from the Trainer Edition. Deep operator tooling stays in Pulse.
        </Text>
      </HStack>
    </VStack>
  )
}
