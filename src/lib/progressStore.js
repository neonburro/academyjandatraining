// src/lib/progressStore.js
// STATUS: active | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Header standardized; Phase 1 checkpoint committed (e765830).
//   2026-08-01  New: local-first progress, shapes mirror migration 0003 tables
// NEXT: Swap localStorage for Supabase once 0003 runs; interface stays identical
// Local-first training progress. Persists to localStorage keyed by user id so
// the app works today, before migration 0003 runs on the live Supabase
// project. The record shapes mirror the step_progress, knowledge_check_attempts
// and commitments tables so swapping this module to Supabase is a data source
// change, not a UI change.
//
// Progression rule: steps unlock sequentially. A step is complete when its
// knowledge check is passed (80 percent or better). Manager sign-off arrives
// in Phase 2 and layers on top without changing this contract.

import { STEPS } from '../content/steps'

const PASS_THRESHOLD = 0.8

function storageKey(userId) {
  return `j13-progress-${userId || 'anon'}`
}

function load(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (raw) return JSON.parse(raw)
  } catch {
    /* corrupted or unavailable storage falls through to fresh state */
  }
  return { steps: {}, attempts: [], commitments: [], activityDays: [] }
}

function save(userId, state) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(state))
  } catch {
    /* private mode or full storage: progress is session-only, app keeps working */
  }
}

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function touchActivity(state) {
  const key = todayKey()
  if (!state.activityDays.includes(key)) state.activityDays.push(key)
}

export function getProgress(userId) {
  const state = load(userId)
  const stepStates = STEPS.map((step, i) => {
    const record = state.steps[step.number] || {}
    const passed = record.status === 'check_passed' || record.status === 'signed_off'
    const prevPassed =
      i === 0 ||
      ['check_passed', 'signed_off'].includes((state.steps[STEPS[i - 1].number] || {}).status)
    return {
      number: step.number,
      slug: step.slug,
      title: step.title,
      status: record.status || 'not_started',
      bestScore: record.bestScore ?? null,
      completedAt: record.completedAt || null,
      passed,
      unlocked: prevPassed,
    }
  })

  const completedCount = stepStates.filter((s) => s.passed).length
  const current = stepStates.find((s) => s.unlocked && !s.passed) || null

  return {
    steps: stepStates,
    completedCount,
    totalCount: STEPS.length,
    percent: Math.round((completedCount / STEPS.length) * 100),
    currentStep: current,
    streakDays: computeStreak(state.activityDays),
    openCommitments: state.commitments.filter((c) => c.status === 'open'),
  }
}

export function startStep(userId, stepNumber) {
  const state = load(userId)
  const record = state.steps[stepNumber] || {}
  if (!record.status || record.status === 'not_started') {
    state.steps[stepNumber] = { ...record, status: 'in_progress', startedAt: new Date().toISOString() }
  }
  touchActivity(state)
  save(userId, state)
}

export function recordAttempt(userId, stepNumber, score, total, answers) {
  const state = load(userId)
  const passed = total > 0 && score / total >= PASS_THRESHOLD
  state.attempts.push({
    stepNumber,
    score,
    total,
    passed,
    answers,
    createdAt: new Date().toISOString(),
  })
  const record = state.steps[stepNumber] || {}
  const bestScore = Math.max(record.bestScore || 0, score)
  state.steps[stepNumber] = {
    ...record,
    bestScore,
    status: passed ? 'check_passed' : record.status === 'check_passed' ? 'check_passed' : 'in_progress',
    completedAt: passed ? record.completedAt || new Date().toISOString() : record.completedAt || null,
  }
  touchActivity(state)
  save(userId, state)
  return { passed, threshold: PASS_THRESHOLD }
}

export function addCommitment(userId, stepNumber, body) {
  const state = load(userId)
  state.commitments.push({
    id: `${Date.now()}-${stepNumber}`,
    stepNumber,
    body,
    status: 'open',
    createdAt: new Date().toISOString(),
  })
  touchActivity(state)
  save(userId, state)
}

export function resolveCommitment(userId, commitmentId, status) {
  const state = load(userId)
  const c = state.commitments.find((x) => x.id === commitmentId)
  if (c && (status === 'kept' || status === 'missed')) {
    c.status = status
    c.resolvedAt = new Date().toISOString()
  }
  save(userId, state)
}

function computeStreak(activityDays) {
  if (!activityDays || activityDays.length === 0) return 0
  const days = new Set(activityDays)
  let streak = 0
  const cursor = new Date()
  if (!days.has(todayKey())) cursor.setDate(cursor.getDate() - 1)
  for (;;) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`
    if (!days.has(key)) break
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}
