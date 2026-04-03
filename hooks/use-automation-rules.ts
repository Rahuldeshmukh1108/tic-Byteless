import { useCallback, useEffect, useState } from 'react'
import { isConfigured } from '@/lib/firebase/config'
import { AutomationRule } from '@/lib/firebase/firestore'
import { subscribeAutomationRules, subscribeAutomationRule } from '@/lib/firebase/realtime'
import { createAutomationRule, updateAutomationRule, deleteAutomationRule } from '@/lib/firebase/firestore'

export function useAutomationRules(userId: string | null) {
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId || !isConfigured) {
      setRules([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const unsubscribe = subscribeAutomationRules(userId, (rules) => {
      setRules(rules)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [userId])

  const addRule = useCallback(
    async (ruleData: Omit<AutomationRule, 'id'>) => {
      if (!userId) throw new Error('User not authenticated')
      
      try {
        setError(null)
        const ruleId = await createAutomationRule(userId, ruleData)
        return ruleId
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create automation rule'
        setError(errorMessage)
        throw err
      }
    },
    [userId]
  )

  const updateRule = useCallback(
    async (ruleId: string, updates: Partial<AutomationRule>) => {
      if (!userId) throw new Error('User not authenticated')
      
      try {
        setError(null)
        await updateAutomationRule(userId, ruleId, updates)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update automation rule'
        setError(errorMessage)
        throw err
      }
    },
    [userId]
  )

  const removeRule = useCallback(
    async (ruleId: string) => {
      if (!userId) throw new Error('User not authenticated')
      
      try {
        setError(null)
        await deleteAutomationRule(userId, ruleId)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete automation rule'
        setError(errorMessage)
        throw err
      }
    },
    [userId]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    rules,
    isLoading,
    error,
    addRule,
    updateRule,
    removeRule,
    clearError,
  }
}

export function useAutomationRule(userId: string | null, ruleId: string | null) {
  const [rule, setRule] = useState<AutomationRule | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId || !ruleId) {
      setRule(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const unsubscribe = subscribeAutomationRule(userId, ruleId, (rule) => {
      setRule(rule)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [userId, ruleId])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    rule,
    isLoading,
    error,
    clearError,
  }
}
