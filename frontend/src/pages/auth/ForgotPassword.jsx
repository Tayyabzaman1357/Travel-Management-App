import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FaEnvelope, FaPaperPlane, FaCircleCheck } from 'react-icons/fa6'
import { useAuth } from '@/context/AuthContext'
import { useSEO } from '@/utils/seo'

export default function ForgotPassword() {
  useSEO('Reset Password — Wanderlust', 'Reset your Wanderlust account password.')
  const { resetPassword } = useAuth()
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    try {
      await resetPassword(data.email)
      setEmail(data.email)
      setSent(true)
    } catch (e) {
      toast.error(e.message || 'Unable to send reset link. Check the email and try again.')
    }
  }

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-ocean-500 text-3xl text-white shadow-glow">
          <FaCircleCheck />
        </motion.div>
        <h1 className="mt-6 font-display text-2xl font-extrabold text-slate-900 dark:text-white">Check your inbox</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          We've sent a password reset link to <span className="font-bold text-brand-600">{email}</span>. The link expires in 60 minutes.
        </p>
        <Link to="/login" className="btn-primary mt-8 w-full">Back to sign in</Link>
        <p className="mt-4 text-xs text-slate-400">Didn't get it? Check spam or <button onClick={() => setSent(false)} className="font-bold text-brand-600 hover:underline">try again</button>.</p>
      </motion.div>
    )
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">Forgot password?</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Enter your account email and we'll send you a secure link to reset your password.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-500">Email</label>
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="email" {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })} placeholder="you@example.com" className="input-base !pl-11" />
          </div>
          {errors.email && <p className="mt-1 text-xs font-semibold text-accent-500">{errors.email.message}</p>}
        </div>
        <button type="submit" className="btn-primary w-full !py-4"><FaPaperPlane /> Send reset link</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Remembered it? <Link to="/login" className="font-bold text-brand-600 dark:text-brand-300 hover:underline">Back to sign in</Link>
      </p>
    </div>
  )
}
