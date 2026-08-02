// src/lib/progressRemote.js
// STATUS: active | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  New: Supabase persistence layer for training progress. Detects
//               whether migration 0003 exists on the live project; if not, every
//               call is a silent no-op and the app stays local-first.
// NEXT: Manager roster queries (Phase 2) build on the same step id map.
//
// All writes are fire-and-forget: the UI never waits on the network. Reads
// happen once per login via pullRemote, merged into the local cache by
// progressStore.hydrateProgress. Auth is the user's own session, so RLS
// (self all, manager read) applies exactly as written in 0003.

import { supabase } from './supabase'

let enabled = null // null = unknown, false = tables missing / no session, true = live
let stepIdByNumber = null
let stepNumberById = null

async function detect() {
  if (enabled !== null) return enabled
  try {
    const { data, error } = await supabase.from('steps').select('id, number').limit(20)
    if (error || !data || data.length === 0) {
      enabled = false
      return enabled
    }
    stepIdByNumber = {}
    stepNumberById = {}
    for (const row of data) {
      stepIdByNumber[row.number] = row.id
      stepNumberById[row.id] = row.number
    }
    enabled = true
  } catch {
    enabled = false
  }
  return enabled
}

export async function remoteAvailable() {
  return detect()
}

// Pull the user's remote state and return it in the local progressStore shape,
// or null when remote is unavailable. Never throws.
export async function pullRemote(userId) {
  if (!userId || !(await detect())) return null
  try {
    const [prog, commits, activity] = await Promise.all([
      supabase
        .from('step_progress')
        .select('step_id, status, best_score, started_at, completed_at')
        .eq('user_id', userId),
      supabase
        .from('commitments')
        .select('id, step_id, body, status, created_at, resolved_at')
        .eq('user_id', userId),
      supabase
        .from('activity_events')
        .select('created_at')
        .eq('user_id', userId)
        .eq('kind', 'training_activity')
        .order('created_at', { ascending: false })
        .limit(400),
    ])
    if (prog.error) return null

    const steps = {}
    for (const row of prog.data || []) {
      const number = stepNumberById[row.step_id]
      if (!number) continue
      steps[number] = {
        status: row.status,
        bestScore: row.best_score != null ? Number(row.best_score) : null,
        startedAt: row.started_at,
        completedAt: row.completed_at,
      }
    }

    const commitments = (commits.data || []).map((c) => ({
      id: c.id,
      stepNumber: stepNumberById[c.step_id] || null,
      body: c.body,
      status: c.status,
      createdAt: c.created_at,
      resolvedAt: c.resolved_at,
    }))

    const activityDays = []
    for (const row of activity.data || []) {
      const key = String(row.created_at).slice(0, 10)
      if (!activityDays.includes(key)) activityDays.push(key)
    }

    return { steps, commitments, activityDays }
  } catch {
    return null
  }
}

// ---- fire-and-forget writes. Each one re-checks detect() so the first write
// after migration 0003 goes live starts persisting without a redeploy. ----

export function pushStepProgress(userId, stepNumber, record) {
  void (async () => {
    if (!userId || !(await detect())) return
    const stepId = stepIdByNumber[stepNumber]
    if (!stepId) return
    await supabase.from('step_progress').upsert(
      {
        user_id: userId,
        step_id: stepId,
        status: record.status || 'in_progress',
        best_score: record.bestScore ?? null,
        completed_at: record.completedAt || null,
      },
      { onConflict: 'user_id,step_id' }
    )
  })()
}

export function pushAttempt(userId, stepNumber, attempt) {
  void (async () => {
    if (!userId || !(await detect())) return
    const stepId = stepIdByNumber[stepNumber]
    if (!stepId) return
    await supabase.from('knowledge_check_attempts').insert({
      user_id: userId,
      step_id: stepId,
      score: attempt.score,
      total: attempt.total,
      passed: attempt.passed,
      answers: attempt.answers || [],
    })
  })()
}

export function pushCommitment(userId, commitment) {
  void (async () => {
    if (!userId || !(await detect())) return
    const stepId = stepIdByNumber[commitment.stepNumber]
    if (!stepId) return
    await supabase.from('commitments').insert({
      id: commitment.id,
      user_id: userId,
      step_id: stepId,
      body: commitment.body,
      status: commitment.status,
    })
  })()
}

export function pushCommitmentResolution(userId, commitmentId, status, resolvedAt) {
  void (async () => {
    if (!userId || !(await detect())) return
    await supabase
      .from('commitments')
      .update({ status, resolved_at: resolvedAt })
      .eq('id', commitmentId)
      .eq('user_id', userId)
  })()
}

export function pushActivity(userId) {
  void (async () => {
    if (!userId || !(await detect())) return
    const today = new Date().toISOString().slice(0, 10)
    const { data } = await supabase
      .from('activity_events')
      .select('id')
      .eq('user_id', userId)
      .eq('kind', 'training_activity')
      .gte('created_at', `${today}T00:00:00Z`)
      .limit(1)
    if (data && data.length > 0) return
    await supabase.from('activity_events').insert({
      user_id: userId,
      kind: 'training_activity',
      metadata: { source: 'progressStore' },
    })
  })()
}
