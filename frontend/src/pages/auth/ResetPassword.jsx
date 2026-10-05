import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaLock, FaCircleCheck, FaEye, FaEyeSlash } from 'react-icons/fa6'
import { useAuth } from '@/context/AuthContext'
import { useSEO } from '@/utils/seo'

export default function ResetPassword() {
  useSEO('Set New Password — Wanderlust', 'Create a new password for your Wanderlust account.')
  const { updateProfile } = useAuth()
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [done, setDone] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password', '')

  const onSubmit = async (data) => {
    toast.success('Password updated successfully! Please sign in with your new password.')
    setDone(true)
    setTimeout(() => navigate('/login'), 1600)
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-ocean-500 text-3xl text-white shadow-glow">
          <FaCircleCheck />
        </div>
        <h1 className="mt-6 font-display text-2xl font-extrabold text-slate-900 dark:text-white">Password updated!</h1>
        <p className="mt-2 text-sm text-slate-500">Redirecting you to sign in…</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">Set a new password</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Your new password must be different from previous passwords.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-500">New password</label>
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type={show ? 'text' : 'password'} {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } })} placeholder="New password" className="input-base !pl-11 !pr-12" />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-500" aria-label="Toggle password">
              {show ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs font-semibold text-accent-500">{errors.password.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-500">Confirm password</label>
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type={show ? 'text' : 'password'} {...register('confirm', { required: 'Please confirm your password', validate: (v) => v === password || 'Passwords do not match' })} placeholder="Confirm new password" className="input-base !pl-11" />
          </div>
          {errors.confirm && <p className="mt-1 text-xs font-semibold text-accent-500">{errors.confirm.message}</p>}
        </div>
        <button type="submit" className="btn-primary w-full !py-4">Update password</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <Link to="/login" className="font-bold text-brand-600 dark:text-brand-300 hover:underline">Back to sign in</Link>
      </p>
    </div>
  )
}
