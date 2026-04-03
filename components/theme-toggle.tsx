'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  // Only render after hydration to prevent mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    // Render a placeholder with the same dimensions to prevent layout shift
    return (
      <button
        disabled
        className="p-2 rounded-lg"
        aria-label="Toggle theme"
      />
    )
  }

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 smooth-transition"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
