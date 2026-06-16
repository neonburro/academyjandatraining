// src/hooks/useAuth.js
// React hook that exposes the current authenticated user, profile, and loading state.
// Subscribes to Supabase auth state changes.

import { useEffect, useState } from 'react'
import { getCurrentSession, getUserProfile, onAuthStateChange } from '../lib/auth'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadInitialSession() {
      const initialSession = await getCurrentSession()
      if (!mounted) return
      setSession(initialSession)
      if (initialSession?.user) {
        const { data: profileData } = await getUserProfile(initialSession.user.id)
        if (mounted) setProfile(profileData)
      }
      if (mounted) setLoading(false)
    }

    loadInitialSession()

    const { data: { subscription } } = onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return
      setSession(newSession)
      if (newSession?.user) {
        const { data: profileData } = await getUserProfile(newSession.user.id)
        if (mounted) setProfile(profileData)
      } else {
        setProfile(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return {
    user: session?.user || null,
    session,
    profile,
    dealership: profile?.dealership || null,
    role: profile?.role || null,
    isAdmin: profile?.role === 'admin',
    isAuthenticated: !!session,
    loading,
  }
}
