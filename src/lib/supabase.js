// src/lib/supabase.js
// STATUS: stable | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Fail soft on missing env vars so local dev without .env.local
//               renders the app (auth disabled) instead of a black screen.
//   2026-08-02  Header standardized; Phase 1 checkpoint committed (e765830).
// Singleton Supabase client for the Academy frontend.
// Realtime is explicitly disabled because we are not using it
// and it caused production crashes on Node 20 in other portfolio repos.

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local')
}

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-anon-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: { eventsPerSecond: 0 },
    },
  }
)
