import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa6'
import { useAuth } from '@/context/AuthContext'
import { useSEO } from '@/utils/seo'
import { cx } from '@/utils/helpers'

function strength(pw) {
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return Math.min(score, 4)
}

export default function Signup() {
  useSEO('Create Account — Wanderlust', 'Join Wanderlust and unlock exclusive travel deals.')
  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password', '')
  const pwScore = strength(password)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const user = await signUp(data.name, data.email, data.password)
      toast.success(`Welcome to Wanderlust, ${user.name.split(' ')[0]}! 🎉`)
      navigate('/dashboard')
    } catch (e) {
      toast.error(e.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const google = async () => {
    setLoading(true)
    try {
      const user = await signInWithGoogle()
      toast.success(`Welcome, ${user.name}! 🎉`)
      navigate('/dashboard')
    } catch (e) {
      toast.error(e.message || 'Google sign-up failed')
    } finally {
      setLoading(false)
    }
  }

  const bars = [
    { on: pwScore >= 1, c: 'bg-accent-500' },
    { on: pwScore >= 2, c: 'bg-amber-500' },
    { on: pwScore >= 3, c: 'bg-lime-500' },
    { on: pwScore >= 4, c: 'bg-emerald-500' },
  ]

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">Create your account</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Join free and get 10% off your first booking with code WELCOME10.</p>

      <button type="button" onClick={google} disabled={loading} className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all hover:border-brand-400 hover:shadow-soft active:scale-[0.98]">
        <FaGoogle className="text-lg text-brand-500" /> Sign up with Google
      </button>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">or</span>
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-500">Full name</label>
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name too short' } })} placeholder="Jane Doe" className="input-base !pl-11" />
          </div>
          {errors.name && <p className="mt-1 text-xs font-semibold text-accent-500">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-500">Email</label>
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="email" {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })} placeholder="you@example.com" className="input-base !pl-11" />
          </div>
          {errors.email && <p className="mt-1 text-xs font-semibold text-accent-500">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-500">Password</label>
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type={showPass ? 'text' : 'password'} {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })} placeholder="Create a strong password" className="input-base !pl-11 !pr-12" />
            <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-500" aria-label="Toggle password">
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {password && (
            <div className="mt-2 flex items-center gap-1.5">
              {bars.map((b, i) => <span key={i} className={cx('h-1.5 flex-1 rounded-full transition-all', b.on ? b.c : 'bg-slate-200 dark:bg-slate-700')} />)}
              <span className="ml-1 text-[11px] font-bold text-slate-400">{['Weak', 'Fair', 'Good', 'Strong', 'Excellent'][pwScore]}</span>
            </div>
          )}
          {errors.password && <p className="mt-1 text-xs font-semibold text-accent-500">{errors.password.message}</p>}
        </div>
        <label className="flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400">
          <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-brand-600" />
          <span>I agree to the <a href="#" onClick={(e) => e.preventDefault()} className="font-bold text-brand-600 hover:underline">Terms of Service</a> and <a href="#" onClick={(e) => e.preventDefault()} className="font-bold text-brand-600 hover:underline">Privacy Policy</a>.</span>
        </label>
        <button type="submit" disabled={loading} className="btn-primary w-full !py-4">
          {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <>Create Account <FaArrowRight /></>}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account? <Link to="/login" className="font-bold text-brand-600 dark:text-brand-300 hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
