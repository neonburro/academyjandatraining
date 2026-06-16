// src/lib/auth.js
// Auth helpers. signInWithIdentifier accepts either a username or an email.
// If it contains an @, treat as email. Otherwise call the lookup-email
// Netlify function to find the matching email server-side, then sign in
// with that email.

import { supabase } from './supabase'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function lookupEmailByUsername(username) {
  try {
    const response = await fetch('/.netlify/functions/lookup-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    })

    if (!response.ok) {
      return { email: null, error: 'Lookup failed' }
    }

    const data = await response.json()
    if (!data.found) {
      return { email: null, error: null }
    }
    return { email: data.email, error: null }
  } catch (err) {
    console.error('lookupEmailByUsername error:', err)
    return { email: null, error: 'Network error' }
  }
}

export async function signInWithIdentifier(identifier, password) {
  const trimmed = (identifier || '').trim()
  if (!trimmed || !password) {
    return { data: null, error: { message: 'Username and password required.' } }
  }

  let email = trimmed

  if (!EMAIL_REGEX.test(trimmed)) {
    const { email: lookedUp, error: lookupError } = await lookupEmailByUsername(trimmed)
    if (lookupError) {
      return { data: null, error: { message: 'Unable to verify credentials. Try again.' } }
    }
    if (!lookedUp) {
      return { data: null, error: { message: 'Invalid username or password.' } }
    }
    email = lookedUp
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return { data, error: { message: 'Invalid username or password.' } }
  }
  return { data, error: null }
}

export async function signInWithPassword(email, password) {
  return signInWithIdentifier(email, password)
}

export async function signUpWithPassword(email, password, metadata = {}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback)
}

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('*, dealership:dealerships(*)')
    .eq('id', userId)
    .single()
  return { data, error }
}
