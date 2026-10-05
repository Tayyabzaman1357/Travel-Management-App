import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaEnvelope, FaLock, FaGoogle, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa6'
import { useAuth } from '@/context/AuthContext'
import { DEMO_ACCOUNTS } from '@/utils/constants'
import { useSEO } from '@/utils/seo'

export default function Login() {
  useSEO('Sign In — Wanderlust', 'Sign in to manage bookings, wishlist and exclusive deals.')
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()

  const from = location.state?.from || '/dashboard'

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const user = await signIn(data.email, data.password)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}! ✈️`)
      navigate(from, { replace: true })
    } catch (e) {
      toast.error(e.message || 'Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const google = async () => {
    setLoading(true)
    try {
      const user = await signInWithGoogle()
      toast.success(`Welcome, ${user.name}! ✈️`)
      navigate(from, { replace: true })
    } catch (e) {
      toast.error(e.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (email, password) => {
    setValue('email', email)
    setValue('password', password)
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Sign in to manage bookings, save favorites and unlock exclusive deals.</p>

      <button
        type="button"
        onClick={google}
        disabled={loading}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all hover:border-brand-400 hover:shadow-soft active:scale-[0.98]"
      >
        <FaGoogle className="text-lg text-brand-500" /> Continue with Google
      </button>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">or</span>
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
            <input type={showPass ? 'text' : 'password'} {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })} placeholder="••••••••" className="input-base !pl-11 !pr-12" />
            <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-brand-500" aria-label="Toggle password">
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs font-semibold text-accent-500">{errors.password.message}</p>}
        </div>
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 font-semibold text-slate-500">
            <input type="checkbox" className="h-4 w-4 accent-brand-600" defaultChecked /> Remember me
          </label>
          <Link to="/forgot-password" className="font-bold text-brand-600 dark:text-brand-300 hover:underline">Forgot password?</Link>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full !py-4">
          {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <>Sign In <FaArrowRight /></>}
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-dashed border-brand-400/40 bg-brand-500/5 p-4">
        <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-brand-600 dark:text-brand-300">Demo accounts</p>
        <div className="grid grid-cols-1 gap-2">
          {DEMO_ACCOUNTS.map((a) => (
            <button key={a.email} onClick={() => fillDemo(a.email, a.password)} className="flex items-center justify-between rounded-xl bg-white/70 dark:bg-slate-900/60 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-all hover:bg-brand-500/10">
              <span>{a.email}</span>
              <span className="chip bg-brand-500/10 text-brand-600 dark:text-brand-300">{a.role}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-slate-400">Click an account to autofill, then Sign In.</p>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Don't have an account? <Link to="/signup" className="font-bold text-brand-600 dark:text-brand-300 hover:underline">Sign up free</Link>
      </p>
    </div>
  )
}
