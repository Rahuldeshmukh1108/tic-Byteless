'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { loginSchema, type LoginFormData } from '@/lib/auth-validation'
import { Loader2, AlertCircle, CheckCircle, LogIn } from 'lucide-react'
import { useAuthState } from '@/hooks/use-auth-state'

export default function LoginPage() {
  const router = useRouter()
  const { isLoading, error, handleLogin, handleGoogleLogin, clearError } = useAuthState()
  const [successMessage, setSuccessMessage] = useState('')
  const [isDemoLoading, setIsDemoLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data: LoginFormData) => {
    clearError()
    setSuccessMessage('')

    const success = await handleLogin(data.email, data.password)
    
    if (success) {
      setSuccessMessage('Login successful! Redirecting...')
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    }
  }

  const handleDemoLogin = async () => {
    setIsDemoLoading(true)
    setSuccessMessage('Entering demo mode...')
    setTimeout(() => {
      router.push('/dashboard')
    }, 500)
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-black/50 dark:from-black dark:via-black dark:to-blue-950/30 flex items-center justify-center px-4 py-12">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 w-72 h-72 bg-cyan-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.2, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"
        />
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
              <div className="w-8 h-8 bg-linear-to-r from-cyan-400 to-blue-600 rounded-lg" />
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

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background dark:bg-black/40 text-foreground/60">Or continue with</span>
            </div>
          </div>

          {/* Demo Login Button */}
          <button
            onClick={handleDemoLogin}
            disabled={isDemoLoading}
            className="w-full px-4 py-2.5 bg-linear-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-70 smooth-transition font-medium flex items-center justify-center gap-2"
          >
            {isDemoLoading && <Loader2 size={20} className="animate-spin" />}
            {isDemoLoading ? 'Entering demo...' : 'Continue with Demo Credentials'}
          </button>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={async () => {
                clearError()
                const success = await handleGoogleLogin()
                if (success) {
                  setSuccessMessage('Google sign-in successful! Redirecting...')
                  setTimeout(() => router.push('/dashboard'), 1000)
                }
              }}
              disabled={isLoading}
              className="w-full px-4 py-2.5 border border-white/20 rounded-lg text-foreground hover:bg-white/5 smooth-transition font-medium flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <LogIn size={18} />
              Continue with Google
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
