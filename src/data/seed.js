// src/data/seed.js
// Stub data for the dashboard, calendar, team, and insights views. Single
// source of truth so swapping in real Supabase data later means changing
// imports in one place, not rewriting components.

export const EVENT_TYPES = {
  live_training: {
    label: 'Live Training',
    color: 'brand.500',
    bgSoft: 'rgba(0, 102, 204, 0.10)',
    description: 'Hosted live by Jazz. Attend and ask questions in real time.',
  },
  content_drop: {
    label: 'Content Drop',
    color: 'success',
    bgSoft: 'rgba(27, 136, 69, 0.10)',
    description: 'New lesson goes live in the course library.',
  },
  live_qa: {
    label: 'Live Q&A',
    color: 'gold',
    bgSoft: 'rgba(201, 162, 75, 0.12)',
    description: 'Open-format dealer Q&A. Bring questions from your floor.',
  },
  milestone: {
    label: 'Team Milestone',
    color: 'inkMuted',
    bgSoft: 'rgba(74, 74, 79, 0.08)',
    description: 'A target your team is working toward.',
  },
  deadline: {
    label: 'Deadline',
    color: 'warn',
    bgSoft: 'rgba(180, 83, 9, 0.10)',
    description: 'Certification, compliance, or program deadline.',
  },
}

export const SEED_EVENTS = [
  {
    id: 'evt-jazz-titanium-trade-ins',
    type: 'live_training',
    title: 'Live Training: Titanium Trade-In Objections',
    host: 'Jazz Janda',
    startAt: '2026-06-26T14:00:00-06:00',
    endAt: '2026-06-26T15:00:00-06:00',
    location: 'Live video',
    joinUrl: 'https://jandatraining.com/live/',
    description:
      'Jazz walks through the four objections that kill titanium trade-in deals and shows the exact talk track that flips them. Powersports and RV floors will benefit most. Bring a real deal you lost recently and Jazz will work through it on air.',
    tags: ['F&I', 'Sales', 'Live'],
    departments: ['sales', 'fi'],
    seatsRemaining: null,
  },
]

export const SEED_TEAM_MEMBERS = []

export const SEED_SUGGESTIONS = []

export function formatEventDate(isoString) {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatEventTime(isoString) {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}
