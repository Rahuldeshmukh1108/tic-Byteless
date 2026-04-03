'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { signupSchema, type SignupFormData } from '@/lib/auth-validation'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuthState } from '@/hooks/use-auth-state'

export default function SignupPage() {
  const router = useRouter()
  const { isLoading, error, handleSignup, clearError } = useAuthState()
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  })

  const password = watch('password')

  const onSubmit = async (data: SignupFormData) => {
    clearError()
    setSuccessMessage('')

    const success = await handleSignup(data.email, data.password, data.name)
    
    if (success) {
      setSuccessMessage('Account created successfully! Redirecting...')
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-black/50 dark:from-black dark:via-black dark:to-blue-950/30 flex items-center justify-center px-4 py-12">
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
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg" />
              HydroSync
            </Link>
            <h1 className="text-3xl font-bold text-foreground mt-4">Create Account</h1>
            <p className="text-foreground/60">Join thousands of smart farmers</p>
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
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Full Name
              </label>
              <input
                {...register('name')}
                id="name"
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-2.5 bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 smooth-transition"
              />
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>

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
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 smooth-transition"
              />
              <p className="text-xs text-foreground/50">
                At least 8 characters, 1 uppercase letter, and 1 number
              </p>
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                {...register('agreeToTerms')}
                id="terms"
                type="checkbox"
                className="mt-1 w-4 h-4 accent-cyan-500"
              />
              <label htmlFor="terms" className="text-sm text-foreground/70">
                I agree to the{' '}
                <Link href="#" className="text-cyan-400 hover:text-cyan-300 smooth-transition">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="text-cyan-400 hover:text-cyan-300 smooth-transition">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-xs text-red-400">{errors.agreeToTerms.message}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-70 smooth-transition flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={20} className="animate-spin" />}
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-foreground/70">
              Already have an account?{' '}
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold smooth-transition">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
