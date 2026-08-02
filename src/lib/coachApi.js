// src/lib/coachApi.js
// STATUS: active | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Header standardized; Phase 1 checkpoint committed (e765830).
//   2026-08-01  New: client for the coach Netlify function + local transcript store
// Client for the coach Netlify function. Transcript persists to localStorage
// per user so the conversation survives reloads; server persistence arrives
// with Phase 2 (chat_sessions and chat_messages already exist in the schema).

const ENDPOINT = '/.netlify/functions/coach'

function transcriptKey(userId) {
  return `j13-coach-${userId || 'anon'}`
}

export function loadTranscript(userId) {
  try {
    const raw = localStorage.getItem(transcriptKey(userId))
    if (raw) return JSON.parse(raw)
  } catch {
    /* fall through to empty transcript */
  }
  return []
}

export function saveTranscript(userId, messages) {
  try {
    localStorage.setItem(transcriptKey(userId), JSON.stringify(messages.slice(-60)))
  } catch {
    /* storage unavailable: transcript is session-only */
  }
}

export function clearTranscript(userId) {
  try {
    localStorage.removeItem(transcriptKey(userId))
  } catch {
    /* nothing to clear */
  }
}

export async function sendToCoach(messages, context) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      context,
    }),
  })
  if (!res.ok) {
    throw new Error(`coach request failed: ${res.status}`)
  }
  const data = await res.json()
  return data
}
