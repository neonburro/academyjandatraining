// src/pages/Dashboard/data.js
// Builds the day's itinerary from the real curriculum and the user's actual
// progress. No more placeholder arrays: the plan is derived from where the
// user sits on the Roadmap, their open next-customer commitments and streak.

import { STEPS } from '../../content/steps'
import { getProgress } from '../../lib/progressStore'

export function buildItinerary(userId) {
  const progress = getProgress(userId)
  const current = progress.currentStep

  const plan = []

  if (current) {
    const fullStep = STEPS.find((s) => s.number === current.number)
    plan.push({
      id: `learn-${current.number}`,
      kind: 'lesson',
      label: current.title,
      helper: `Step ${current.number} of 13`,
      meta: 'Roadmap to the Sale',
      to: `/courses/roadmap/${current.slug}/`,
    })
    plan.push({
      id: `check-${current.number}`,
      kind: 'quiz',
      label: `${current.title} knowledge check`,
      helper: `${fullStep?.knowledgeCheck?.length || 4} questions, 80 percent to pass`,
      meta: 'Roadmap to the Sale',
      to: `/courses/roadmap/${current.slug}/`,
    })
  }

  const openCommitment = progress.openCommitments[0]
  if (openCommitment) {
    plan.push({
      id: 'commitment',
      kind: 'reflection',
      label: 'Check in on your commitment',
      helper: openCommitment.body.length > 60 ? `${openCommitment.body.slice(0, 60)}...` : openCommitment.body,
      meta: 'Next customer',
      to: '/coach/',
    })
  } else {
    plan.push({
      id: 'coach-practice',
      kind: 'reflection',
      label: 'Two minutes with the Coach',
      helper: 'Role-play or a quick quiz',
      meta: 'Practice',
      to: '/coach/',
    })
  }

  const DAY_LABELS = ['Next', 'Then', 'Later']
  const upNext = progress.steps
    .filter((s) => !s.passed && s.number !== current?.number)
    .slice(0, 3)
    .map((s, i) => ({ day: DAY_LABELS[i], label: `Step ${s.number}: ${s.title}` }))

  return {
    plan,
    course: {
      title: 'Roadmap to the Sale',
      completed: progress.completedCount,
      total: progress.totalCount,
    },
    upNext,
    streakDays: progress.streakDays,
    currentStep: current,
    done: !current,
  }
}
