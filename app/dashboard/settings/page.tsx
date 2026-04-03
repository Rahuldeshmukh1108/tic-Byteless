'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Bell, Lock, User, Zap, Shield, LogOut, Sun, Moon, Globe } from 'lucide-react'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  const [savedMessage, setSavedMessage] = useState('')
  const [profile, setProfile] = useState({
    fullName: 'John Farmer',
    email: 'john@hydrosync.com',
    phone: '+1 (555) 123-4567',
  })

  const [toggles, setToggles] = useState({
    'Critical Alerts': true,
    'Warning Alerts': true,
    'Daily Summary': false,
    'Email Notifications': true,
  })

  const handleToggle = (label: string) => {
    setToggles((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const handleProfileChange = (key: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    setSavedMessage('Settings saved successfully!')
    setTimeout(() => setSavedMessage(''), 3000)
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
      toggleItems: [
        { label: 'Critical Alerts', enabled: true },
        { label: 'Warning Alerts', enabled: true },
        { label: 'Daily Summary', enabled: false },
        { label: 'Email Notifications', enabled: true },
      ],
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
          {[
            { label: 'Critical Alerts', enabled: true },
            { label: 'Warning Alerts', enabled: true },
            { label: 'Daily Summary', enabled: false },
            { label: 'Email Notifications', enabled: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-start gap-3 py-3 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/30 smooth-transition">
              <span className="text-slate-700 dark:text-slate-300 font-medium flex-1">{item.label}</span>
              <button
                onClick={() => handleToggle(item.label)}
                className={`relative w-14 h-7 rounded-full smooth-transition ${
                  toggles[item.label as keyof typeof toggles]
                    ? 'bg-cyan-500'
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full smooth-transition ${
                    toggles[item.label as keyof typeof toggles]
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
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-lg text-sm font-medium smooth-transition ${
                  language === 'en'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
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
        <button className="px-4 py-2.5 bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 rounded-lg font-semibold hover:bg-red-500/30 smooth-transition flex items-center gap-2 text-sm">
          <LogOut size={18} />
          Logout
        </button>
      </motion.div>
    </div>
  )
}
