// netlify/functions/lookup-email.js
// Server-side username to email lookup. Uses service_role key to bypass RLS,
// since the user is not yet authenticated when calling this. Returns generic
// 'not found' rather than leaking which usernames exist.

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('lookup-email: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { params: { eventsPerSecond: 0 } },
})

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  let username
  try {
    const body = JSON.parse(event.body || '{}')
    username = (body.username || '').trim().toLowerCase()
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) }
  }

  if (!username) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Username required' }) }
  }

  const { data, error } = await supabase
    .from('users')
    .select('email')
    .ilike('username', username)
    .maybeSingle()

  if (error) {
    console.error('lookup-email error:', error)
    return { statusCode: 500, body: JSON.stringify({ error: 'Lookup failed' }) }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ found: !!data, email: data?.email || null }),
  }
}
