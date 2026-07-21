// src/lib/auth.js
// Auth helpers. signInWithIdentifier accepts either a username or an email.
// Password reset uses Supabase's built-in flow with a custom redirect URL.
//
// (2026-07-21) Added verifyCurrentPassword and changeEmail to power the
// Settings page: re-verify the current password before sensitive changes,
// and change the account email (Supabase confirms via the new address).

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

export async function sendPasswordReset(email) {
  const trimmed = (email || '').trim()
  if (!EMAIL_REGEX.test(trimmed)) {
    return { error: { message: 'Please enter a valid email address.' } }
  }

  const redirectTo = `${window.location.origin}/reset-password/`
  const { data, error } = await supabase.auth.resetPasswordForEmail(trimmed, {
    redirectTo,
  })
  return { data, error }
}

export async function updatePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword })
  return { data, error }
}

// Verify the current password by attempting a silent re-auth with the account's
// own email. Returns { ok, error }. Used to unlock sensitive Settings actions
// (change email, change password) so a walk-up cannot change them.
export async function verifyCurrentPassword(currentPassword) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) {
    return { ok: false, error: { message: 'Not signed in.' } }
  }
  const { error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  })
  if (error) {
    return { ok: false, error: { message: 'Current password is incorrect.' } }
  }
  return { ok: true, error: null }
}

// Change email. Supabase sends a confirmation link to the NEW address; the
// change only takes effect once the user clicks it. Callers should verify the
// current password first (see verifyCurrentPassword).
export async function changeEmail(newEmail) {
  const trimmed = (newEmail || '').trim().toLowerCase()
  if (!EMAIL_REGEX.test(trimmed)) {
    return { data: null, error: { message: 'Please enter a valid email address.' } }
  }
  const { data, error } = await supabase.auth.updateUser({ email: trimmed })
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