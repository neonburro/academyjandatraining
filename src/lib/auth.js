// src/lib/auth.js
// Auth helpers wrapping Supabase auth methods.

import { supabase } from './supabase'

export async function signInWithPassword(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
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
