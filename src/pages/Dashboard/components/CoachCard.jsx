// src/pages/Dashboard/components/CoachCard.jsx
// The door to the live J13 Coach. Personalizes the invitation with the user's
// current step so the nudge is specific, then routes to /coach/.

import { useNavigate } from 'react-router-dom'
import { Box, HStack, Text, Flex, Icon, Button } from '@chakra-ui/react'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function CoachCard({ firstName, currentStep }) {
  const navigate = useNavigate()
  return (
    <Box bg="ink" color="white" borderRadius="cardLg" p={6} position="relative" overflow="hidden">
      <HStack spacing={3} mb={4}>
        <Flex w={8} h={8} borderRadius="full" bg="whiteAlpha.200" align="center" justify="center">
          <Icon as={Sparkles} boxSize={4} color="white" />
        </Flex>
        <Text fontSize="xs" fontWeight={600} letterSpacing="0.08em" textTransform="uppercase" color="whiteAlpha.800">
          Your coach
        </Text>
      </HStack>
      <Text fontSize="md" lineHeight={1.6} color="whiteAlpha.900" maxW="52ch" mb={5}>
        {firstName ? `${firstName}, ` : ''}
        {currentStep
          ? `you're on Step ${currentStep.number}, ${currentStep.title}. I can quiz you on it, play the customer or talk through your next one.`
          : 'ready to sharpen up? I can run role-play, quiz you on any step or talk through your next customer.'}
      </Text>
      <Button
        bg="white"
        color="ink"
        size="sm"
        _hover={{ bg: 'whiteAlpha.900' }}
        _active={{ bg: 'whiteAlpha.800' }}
        rightIcon={<ArrowRight size={15} />}
        onClick={() => navigate('/coach/')}
      >
        Talk to the Coach
      </Button>
    </Box>
  )
}
