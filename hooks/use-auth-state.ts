import { useState, useCallback } from 'react'
import { isConfigured } from '@/lib/firebase/config'
import { signup, login, logout, getAuthErrorMessage } from '@/lib/firebase/auth'

const NOT_CONFIGURED_MESSAGE = 'Firebase is not configured. Please add your Firebase credentials to .env.local'

export function useAuthState() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignup = useCallback(
    async (email: string, password: string, name: string) => {
      if (!isConfigured) {
        setError(NOT_CONFIGURED_MESSAGE)
        return false
      }

      setIsLoading(true)
      setError(null)
      try {
        await signup(email, password, name)
        return true
      } catch (err: any) {
        const errorMessage = getAuthErrorMessage(err)
        setError(errorMessage)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      if (!isConfigured) {
        setError(NOT_CONFIGURED_MESSAGE)
        return false
      }

      setIsLoading(true)
      setError(null)
      try {
        await login(email, password)
        return true
      } catch (err: any) {
        const errorMessage = getAuthErrorMessage(err)
        setError(errorMessage)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const handleLogout = useCallback(async () => {
    if (!isConfigured) {
      setError(NOT_CONFIGURED_MESSAGE)
      return false
    }

    setIsLoading(true)
    setError(null)
    try {
      await logout()
      return true
    } catch (err: any) {
      const errorMessage = getAuthErrorMessage(err)
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    handleSignup,
    handleLogin,
    handleLogout,
    clearError,
  }
}
