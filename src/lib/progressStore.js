// src/lib/progressStore.js
// STATUS: active | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Supabase write-through wired: every mutation also pushes to the
//               live tables via progressRemote (no-op until migration 0003 runs),
//               and hydrateProgress pulls + merges remote state at login.
//               Commitment ids are now crypto.randomUUID so local and remote
//               rows share identity. Header standardized; checkpoint e765830.
//   2026-08-01  New: local-first progress, shapes mirror migration 0003 tables
// NEXT: Once 0003 + 0004 are confirmed live, watch for the first real rows,
//       then Phase 2 manager views read the same tables.
//
// localStorage stays the synchronous source of truth for the UI, so every
// existing getProgress call keeps working unchanged. Supabase is the durable
// copy: writes stream up in the background, and login merges the remote state
// down (furthest progress wins). If the tables don't exist yet, remote is a
// silent no-op and the app behaves exactly as before.
//
// Progression rule: steps unlock sequentially. A step is complete when its
// knowledge check is passed (80 percent or better). Manager sign-off arrives
// in Phase 2 and layers on top without changing this contract.

import { STEPS } from '../content/steps'
import {
  pullRemote,
  pushStepProgress,
  pushAttempt,
  pushCommitment,
  pushCommitmentResolution,
  pushActivity,
} from './progressRemote'

const PASS_THRESHOLD = 0.8
const STATUS_RANK = { not_started: 0, in_progress: 1, check_passed: 2, signed_off: 3 }

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

function touchActivity(state, userId) {
  const key = todayKey()
  if (!state.activityDays.includes(key)) state.activityDays.push(key)
  pushActivity(userId)
}

// Pull remote state and merge it into the local cache. Furthest progress wins
// per step, commitments union by id, activity days union. Bounded by a short
// timeout so a slow network can never hold up app startup. Returns true when
// the merge changed anything. Never throws.
export async function hydrateProgress(userId) {
  if (!userId) return false
  const timeout = new Promise((resolve) => setTimeout(() => resolve(null), 3000))
  const remote = await Promise.race([pullRemote(userId), timeout])
  if (!remote) return false

  const state = load(userId)
  let changed = false

  for (const [num, r] of Object.entries(remote.steps || {})) {
    const local = state.steps[num] || {}
    const localRank = STATUS_RANK[local.status] ?? 0
    const remoteRank = STATUS_RANK[r.status] ?? 0
    if (remoteRank > localRank) {
      state.steps[num] = { ...local, ...r }
      changed = true
    } else if (remoteRank === localRank && (r.bestScore || 0) > (local.bestScore || 0)) {
      state.steps[num] = { ...local, bestScore: r.bestScore }
      changed = true
    }
  }

  const known = new Set(state.commitments.map((c) => c.id))
  for (const c of remote.commitments || []) {
    if (!known.has(c.id)) {
      state.commitments.push(c)
      changed = true
    }
  }

  for (const day of remote.activityDays || []) {
    if (!state.activityDays.includes(day)) {
      state.activityDays.push(day)
      changed = true
    }
  }

  if (changed) save(userId, state)
  return changed
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
    pushStepProgress(userId, stepNumber, state.steps[stepNumber])
  }
  touchActivity(state, userId)
  save(userId, state)
}

export function recordAttempt(userId, stepNumber, score, total, answers) {
  const state = load(userId)
  const passed = total > 0 && score / total >= PASS_THRESHOLD
  const attempt = {
    stepNumber,
    score,
    total,
    passed,
    answers,
    createdAt: new Date().toISOString(),
  }
  state.attempts.push(attempt)
  const record = state.steps[stepNumber] || {}
  const bestScore = Math.max(record.bestScore || 0, score)
  state.steps[stepNumber] = {
    ...record,
    bestScore,
    status: passed ? 'check_passed' : record.status === 'check_passed' ? 'check_passed' : 'in_progress',
    completedAt: passed ? record.completedAt || new Date().toISOString() : record.completedAt || null,
  }
  pushAttempt(userId, stepNumber, attempt)
  pushStepProgress(userId, stepNumber, state.steps[stepNumber])
  touchActivity(state, userId)
  save(userId, state)
  return { passed, threshold: PASS_THRESHOLD }
}

export function addCommitment(userId, stepNumber, body) {
  const state = load(userId)
  const commitment = {
    id:
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${stepNumber}`,
    stepNumber,
    body,
    status: 'open',
    createdAt: new Date().toISOString(),
  }
  state.commitments.push(commitment)
  pushCommitment(userId, commitment)
  touchActivity(state, userId)
  save(userId, state)
}

export function resolveCommitment(userId, commitmentId, status) {
  const state = load(userId)
  const c = state.commitments.find((x) => x.id === commitmentId)
  if (c && (status === 'kept' || status === 'missed')) {
    c.status = status
    c.resolvedAt = new Date().toISOString()
    pushCommitmentResolution(userId, commitmentId, status, c.resolvedAt)
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
