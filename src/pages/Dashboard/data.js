// src/pages/Dashboard/data.js
// Placeholder itinerary data for the dashboard preview. Clearly separated so
// it is obvious what is real vs preview. When courses and progress land in
// Supabase, these arrays get replaced by live queries with no layout change.

export const TODAYS_PLAN = [
  {
    id: 'lesson-1',
    kind: 'lesson',
    label: 'The Meet & Greet',
    helper: '4 min lesson',
    meta: 'Sales Foundations',
  },
  {
    id: 'quiz-1',
    kind: 'quiz',
    label: 'Objection handling check',
    helper: '5 questions',
    meta: 'Sales Foundations',
  },
  {
    id: 'reflect-1',
    kind: 'reflection',
    label: 'Log one win from yesterday',
    helper: 'Daily habit',
    meta: 'Reflection',
  },
]

export const CURRENT_COURSE = {
  title: 'Sales Foundations',
  completed: 2,
  total: 5,
}

export const UP_NEXT = [
  { day: 'Tomorrow', label: 'Trade evaluation' },
  { day: 'Wed', label: 'Feature and benefit presentation' },
  { day: 'Thu', label: 'The trial close' },
]

export const STREAK_DAYS = 1