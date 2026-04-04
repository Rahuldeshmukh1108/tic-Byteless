'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { loginSchema, type LoginFormData } from '@/lib/auth-validation'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuthState } from '@/hooks/use-auth-state'
import { useAuth } from '@/contexts/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { isLoading, error, handleLogin, clearError } = useAuthState()
  const [successMessage, setSuccessMessage] = useState('')
  const [signedIn, setSignedIn] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  useEffect(() => {
    if (user) {
      router.replace('/dashboard')
    }
  }, [user, router])

  useEffect(() => {
    if (signedIn && user) {
      router.replace('/dashboard')
    }
  }, [signedIn, user, router])

  const onSubmit = async (data: LoginFormData) => {
    clearError()
    setSuccessMessage('')

    const success = await handleLogin(data.email, data.password)
    if (success) {
      setSuccessMessage('Login successful! Finalizing session...')
      setSignedIn(true)
    }
  }


  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 -z-10">
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-500/25 to-purple-600/25 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 1 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-green-400/15 to-cyan-500/15 rounded-full blur-2xl"
        />

        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(6,182,212,0.3)_1px,transparent_0)] bg-[length:40px_40px]" />
        </div>

        {/* Floating hydroponic elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-32 left-16 w-12 h-12 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-full blur-sm"
        />
        <motion.div
          animate={{
            y: [0, 15, 0],
            x: [0, -10, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          className="absolute bottom-40 right-32 w-8 h-8 bg-gradient-to-br from-blue-400/25 to-cyan-500/25 rounded-full blur-sm"
        />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full bg-[linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glassmorphism-light p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl gradient-text">
              <img
                src="/logo.png"
                alt="HydroSync Logo"
                className="w-8 h-8"
              />
              HydroSync
            </Link>
            <h1 className="text-3xl font-bold text-foreground mt-4">Welcome Back</h1>
            <p className="text-foreground/60">Sign in to your account</p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <AlertCircle size={20} className="text-red-500" />
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-lg"
            >
              <CheckCircle size={20} className="text-green-500" />
              <p className="text-sm text-green-400">{successMessage}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 smooth-transition"
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Link href="#" className="text-xs text-cyan-400 hover:text-cyan-300 smooth-transition">
                  Forgot password?
                </Link>
              </div>
              <input
                {...register('password')}
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 smooth-transition"
              />
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2">
              <input
                {...register('rememberMe')}
                id="rememberMe"
                type="checkbox"
                className="w-4 h-4 accent-cyan-500"
              />
              <label htmlFor="rememberMe" className="text-sm text-foreground/70">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-70 smooth-transition flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={20} className="animate-spin" />}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Signup Link */}
          <div className="text-center">
            <p className="text-foreground/70">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold smooth-transition">
                Sign up
              </Link>
            </p>
          </div>

        </div>
      </motion.div>
    </main>
  )
}
