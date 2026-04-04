'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Bell, Lock, User, Zap, Shield, LogOut, Sun, Moon, Globe } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useAuthState } from '@/hooks/use-auth-state'
import { getUserSettings, updateUserSettings, createUserSettings } from '@/lib/firebase/firestore'
import { subscribeUserSettings } from '@/lib/firebase/realtime'
import { UserSettings } from '@/lib/firebase/firestore'

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { user, userProfile, loading: authLoading } = useAuth()
  const { handleLogout } = useAuthState()
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [savedMessage, setSavedMessage] = useState('')
  const [language, setLanguage] = useState<UserSettings['preferences']['language']>('en')
  const [profile, setProfile] = useState({
    fullName: userProfile?.name || user?.displayName || 'John Farmer',
    email: user?.email || 'john@hydrosync.com',
    phone: '+1 (555) 123-4567',
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !authLoading) {
      router.push('/login')
    }
  }, [user, authLoading])

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated
  if (!user) {
    return null
  }

  const handleProfileChange = (key: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

  const handleToggle = (label: string) => {
    if (!userSettings) return

    const keyMap: Record<string, keyof UserSettings['notifications']> = {
      'Critical Alerts': 'criticalAlerts',
      'Warning Alerts': 'warningAlerts',
      'Daily Summary': 'dailySummary',
      'Email Notifications': 'emailNotifications',
    }

    const settingKey = keyMap[label]
    if (settingKey) {
      setUserSettings((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          notifications: {
            ...prev.notifications,
            [settingKey]: !prev.notifications[settingKey],
          },
        }
      })
    }
  }

  const handleLanguageChange = (newLanguage: UserSettings['preferences']['language']) => {
    setLanguage(newLanguage)
  }

  useEffect(() => {
    if (userProfile) {
      setProfile({
        fullName: userProfile.name,
        email: userProfile.email,
        phone: userSettings?.profile?.phone || '',
      })
    } else if (user) {
      setProfile((prev) => ({
        ...prev,
        fullName: user.displayName || prev.fullName,
        email: user.email || prev.email,
      }))
    }
  }, [user, userProfile, userSettings])

  useEffect(() => {
    if (!user || authLoading) return

    // Subscribe to user settings in real-time
    const unsubscribe = subscribeUserSettings(user.uid, (settings) => {
      if (settings) {
        setUserSettings(settings)
        // Update theme if it differs
        if (settings.preferences.theme !== theme) {
          setTheme(settings.preferences.theme)
        }
        // Update language if it differs
        if (settings.preferences.language !== language) {
          setLanguage(settings.preferences.language)
        }
      } else {
        // Create default settings if none exist
        const defaultSettings: Omit<UserSettings, 'userId' | 'createdAt' | 'updatedAt'> = {
          notifications: {
            criticalAlerts: true,
            warningAlerts: true,
            dailySummary: false,
            emailNotifications: true,
          },
          preferences: {
            language: 'en',
            theme: (theme as 'light' | 'dark' | 'system') || 'dark',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          profile: {
            fullName: userProfile?.name || user?.displayName || '',
            phone: '',
            location: '',
            farmSize: undefined,
            cropTypes: [],
          },
        }
        createUserSettings(user.uid, defaultSettings)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [user, theme, setTheme, language, userProfile, authLoading])

  const handleSave = async () => {
    if (!user || !userSettings) return

    try {
      await updateUserSettings(user.uid, {
        notifications: userSettings.notifications,
        preferences: {
          ...userSettings.preferences,
          theme: theme as 'light' | 'dark' | 'system',
          language: language,
        },
        profile: {
          ...userSettings.profile,
          fullName: profile.fullName,
          phone: profile.phone,
        },
      })
      setSavedMessage('Settings saved successfully!')
      setTimeout(() => setSavedMessage(''), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setSavedMessage('Error saving settings. Please try again.')
      setTimeout(() => setSavedMessage(''), 3000)
    }
  }

  const handleLogoutClick = async () => {
    const success = await handleLogout()
    if (success) {
      router.push('/login')
    }
  }

  const sections = [
    {
      icon: <User size={20} />,
      title: 'Profile Settings',
      description: 'Manage your account information',
      type: 'profile',
      fields: Object.entries(profile),
    },
    {
      icon: <Bell size={20} />,
      title: 'Notifications',
      description: 'Configure alert preferences',
      type: 'toggles',
      toggleItems: userSettings ? [
        { label: 'Critical Alerts', enabled: userSettings.notifications.criticalAlerts },
        { label: 'Warning Alerts', enabled: userSettings.notifications.warningAlerts },
        { label: 'Daily Summary', enabled: userSettings.notifications.dailySummary },
        { label: 'Email Notifications', enabled: userSettings.notifications.emailNotifications },
      ] : [],
    },
    {
      icon: <Zap size={20} />,
      title: 'Preferences',
      description: 'Customize your experience',
      type: 'preferences',
    },
    {
      icon: <Shield size={20} />,
      title: 'Security',
      description: 'Manage security settings',
      type: 'security',
    },
  ]

  return (
    <div className="space-y-8 w-full min-h-screen" style={{
      backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px), radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)',
      backgroundSize: '20px 20px, 20px 20px',
      backgroundPosition: '0 0, 10px 10px'
    }}>
      <div>
        <h1 className="text-4xl font-bold text-foreground dark:text-slate-100 mb-2">Settings</h1>
        <p className="text-foreground/60 dark:text-slate-400">Manage your account and preferences</p>
      </div>

      {savedMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-green-100 dark:bg-green-500/20 border border-green-300 dark:border-green-500/50 text-green-700 dark:text-green-400"
        >
          {savedMessage}
        </motion.div>
      )}

      {/* Profile Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}
        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
            <User size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Profile Settings</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Manage your account information</p>
          </div>
        </div>

        <div className="space-y-4 max-w-2xl">
          {Object.entries(profile).map(([key, value]) => (
            <div key={key} className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <label className="w-full sm:w-40 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 sm:mb-0 capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => handleProfileChange(key as keyof typeof profile, e.target.value)}
                className="w-full sm:w-[calc(100%-160px)] px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 smooth-transition"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
            <Bell size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Notifications</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Configure alert preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {sections.find(s => s.type === 'toggles')?.toggleItems?.map((item) => (
            <div key={item.label} className="flex items-center justify-start gap-3 py-3 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/30 smooth-transition">
              <span className="text-slate-700 dark:text-slate-300 font-medium flex-1">{item.label}</span>
              <button
                onClick={() => handleToggle(item.label)}
                className={`relative w-14 h-7 rounded-full smooth-transition ${
                  item.enabled
                    ? 'bg-cyan-500'
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full smooth-transition ${
                    item.enabled
                      ? 'translate-x-7'
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
            <Zap size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Preferences</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Customize your experience</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-start gap-4 py-3 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/30 smooth-transition">
            <div className="flex items-center gap-2 flex-1">
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              <span className="text-slate-700 dark:text-slate-300 font-medium">Theme</span>
            </div>
            <div className="flex gap-2">              <button
                onClick={() => setTheme('light')}
                className={`px-3 py-1 rounded-lg text-sm font-medium smooth-transition ${
                  theme === 'light'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-3 py-1 rounded-lg text-sm font-medium smooth-transition ${
                  theme === 'dark'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/30 smooth-transition">
            <div className="flex items-center gap-2">
              <Globe size={18} />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Language</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1 rounded-lg text-sm font-medium smooth-transition ${
                  language === 'en'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange('hi')}
                className={`px-3 py-1 rounded-lg text-sm font-medium smooth-transition ${
                  language === 'hi'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                HI
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400">
            <Shield size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Security</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Manage security settings</p>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-100 text-sm hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 smooth-transition flex items-center gap-2">
            <Lock size={16} />
            Change Password
          </button>
          <button className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-100 text-sm hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 smooth-transition">
            View Sessions
          </button>
          <button className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-100 text-sm hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 smooth-transition">
            2FA Setup
          </button>
        </div>
      </motion.div>

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3 flex-wrap"
      >
        <button onClick={handleSave} className="w-fit px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 smooth-transition text-sm">
          Save Changes
        </button>
        <button
          onClick={handleLogoutClick}
          className="px-4 py-2.5 bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 rounded-lg font-semibold hover:bg-red-500/30 smooth-transition flex items-center gap-2 text-sm"
        >
          <LogOut size={18} />
          Logout
        </button>
      </motion.div>
    </div>
  )
}
