'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from 'firebase/auth'
import { isConfigured } from '@/lib/firebase/config'
import { onAuthStateChange, getUserProfile } from '@/lib/firebase/auth'
import { UserProfile } from '@/lib/firebase/auth'

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  error: string | null
  isConfigured: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isConfigured) {
      // Firebase not configured, skip auth state listening
      setLoading(false)
      setError('Firebase is not configured. Please add your Firebase credentials to .env.local')
      return
    }

    const unsubscribe = onAuthStateChange(async (authUser) => {
      try {
        setUser(authUser)

        if (authUser) {
          const profile = await getUserProfile(authUser.uid)
          setUserProfile(profile)
        } else {
          setUserProfile(null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, error, isConfigured }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
