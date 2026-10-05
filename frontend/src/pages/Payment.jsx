import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {  FaCreditCard, FaPaypal, FaMobileScreenButton, FaMoneyBillWave, FaLock, FaCircleCheck, FaWallet, FaArrowLeft, FaCcVisa, FaCcMastercard, FaCcAmex,
} from 'react-icons/fa6'
import Breadcrumb from '@/components/common/Breadcrumb'
import Img from '@/components/common/Img'
import EmptyState from '@/components/common/EmptyState'
import { useBookings } from '@/context/BookingContext'
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import { paymentService } from '@/services/paymentService'
import { formatDate } from '@/utils/format'
import { useSEO } from '@/utils/seo'
import { cx } from '@/utils/helpers'

const methods = [
  { id: 'card', label: 'Credit Card', icon: <FaCreditCard />, desc: 'Visa, Mastercard, Amex' },
  { id: 'paypal', label: 'PayPal', icon: <FaPaypal />, desc: 'Pay with your PayPal balance' },
  { id: 'jazzcash', label: 'JazzCash', icon: <FaMobileScreenButton />, desc: 'Mobile wallet (PK)' },
  { id: 'easypaisa', label: 'EasyPaisa', icon: <FaMoneyBillWave />, desc: 'Mobile wallet (PK)' },
]

export default function Payment() {
  useSEO('Secure Payment — Wanderlust', 'Complete your secure payment with card, PayPal, JazzCash or EasyPaisa.')
  const { draft, clearDraft, refresh } = useBookings()
  const { user } = useAuth()
  const { formatPrice } = useApp()
  const navigate = useNavigate()
  const [method, setMethod] = useState('card')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(null)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm()

  // Success screen must be checked BEFORE the draft guard (draft is cleared on success)
  if (success) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50 via-white to-ocean-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
        <Confetti />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="container-x max-w-2xl px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
            className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-ocean-500 shadow-glow"
          >
            <svg viewBox="0 0 52 52" className="h-14 w-14">
              <motion.path
                fill="none"
                stroke="#fff"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 27l8 8 16-18"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              />
            </svg>
          </motion.div>
          <h1 className="mt-8 font-display text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">Booking Confirmed! 🎉</h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400">Your {success.type} booking has been confirmed. A confirmation email with your e-ticket is on its way.</p>
          <div className="glass-strong mx-auto mt-8 max-w-md rounded-3xl p-6 text-left">
            <div className="flex items-center justify-between border-b border-dashed border-slate-300 dark:border-slate-700 pb-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Booking reference</p>
                <p className="font-display text-2xl font-extrabold text-gradient">{success.reference}</p>
              </div>
              <span className="chip bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Confirmed</span>
            </div>
            <div className="mt-4 space-y-2.5 text-sm">
              <p className="flex justify-between"><span className="text-slate-500">Item</span><span className="font-bold text-slate-900 dark:text-white">{success.itemName}</span></p>
              <p className="flex justify-between"><span className="text-slate-500">Dates</span><span className="font-bold text-slate-900 dark:text-white">{formatDate(success.date)}{success.endDate ? ` – ${formatDate(success.endDate)}` : ''}</span></p>
              <p className="flex justify-between"><span className="text-slate-500">Paid via</span><span className="font-bold text-slate-900 dark:text-white">{success.paymentMethod}</span></p>
              <p className="flex justify-between font-display text-base font-extrabold"><span className="text-slate-900 dark:text-white">Total paid</span><span className="text-gradient">{formatPrice(success.total)}</span></p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/dashboard" className="btn-primary"><FaCircleCheck /> View my bookings</Link>
            <Link to="/" className="btn-outline"><FaArrowLeft /> Back to home</Link>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container-x pt-40">
        <EmptyState
          icon={<FaLock />}
          title="Sign in to check out"
          text="Bookings are linked to your account. Sign in to complete this payment securely."
          action={<Link to="/login" state={{ from: '/payment' }} className="btn-primary">Sign in</Link>}
        />
      </div>
    )
  }

  if (!draft) {
    return (
      <div className="container-x pt-40">
        <EmptyState
          icon={<FaWallet />}
          title="Nothing to pay for"
          text="Your booking session has expired. Please start a new booking."
          action={<Link to="/flights" className="btn-primary">Start a booking</Link>}
        />
      </div>
    )
  }

  const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
  }

  const pay = async (data) => {
    if (method === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) { toast.error('Please enter a valid card number'); setProcessing(false); return }
      if (expiry.length < 5) { toast.error('Please enter card expiry date'); setProcessing(false); return }
      if (cvc.length < 3) { toast.error('Please enter the CVC code'); setProcessing(false); return }
    }
    setProcessing(true)
    try {
      // Simulated gateway delay
      await new Promise((r) => setTimeout(r, 1800))
      const { booking } = await paymentService.checkout({
        type: draft.type,
        itemId: draft.item.id,
        itemName: draft.title,
        image: draft.item.image,
        date: draft.dates.start,
        endDate: draft.type === 'hotel' || draft.type === 'car' ? draft.dates.end : undefined,
        guests: draft.guests,
        rooms: draft.rooms,
        amount: draft.total,
        currency: 'USD',
        method,
        cardLast4: method === 'card' ? cardNumber.replace(/\s/g, '').slice(-4) : '',
        email: data.email,
        phone: data.phone,
        travelers: draft.travelers.map((t) => ({ name: `${t.firstName} ${t.lastName}`.trim() })),
        seats: Object.values(draft.seats || {}),
        contact: { email: data.email, phone: data.phone },
      })
      await refresh()
      setSuccess(booking)
      clearDraft()
    } catch (e) {
      toast.error(e.message || 'Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }


  const isMobileWallet = method === 'jazzcash' || method === 'easypaisa'

  return (
    <div className="pt-28">
      <div className="container-x pb-16">
        <div className="mb-6"><Breadcrumb items={[{ label: 'Booking', to: `/booking?type=${draft.type}&id=${draft.item.id}` }, { label: 'Payment' }]} /></div>
        <h1 className="flex items-center gap-3 font-display text-3xl font-extrabold text-slate-900 dark:text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-ocean-500 text-white"><FaLock /></span>
          Secure Checkout
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">256-bit SSL encrypted · PCI-DSS compliant · Never stored on our servers</p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Methods */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {methods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={cx(
                    'flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all duration-300',
                    method === m.id ? 'border-brand-500 bg-brand-500/5 shadow-glow' : 'border-slate-200 dark:border-slate-700 hover:border-brand-300'
                  )}
                >
                  <span className={cx('text-2xl', method === m.id ? 'text-brand-600 dark:text-brand-300' : 'text-slate-400')}>{m.icon}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{m.label}</span>
                  <span className="text-[10px] text-slate-400">{m.desc}</span>
                </button>
              ))}
            </div>

            {/* Card form */}
            <AnimatePresence mode="wait">
              <motion.div key={method} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="glass mt-6 rounded-3xl p-6 sm:p-8">
                {method === 'card' && (
                  <form id="pay-form" onSubmit={handleSubmit(pay)} noValidate>
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 p-6 text-white shadow-soft-lg">
                      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/20 blur-2xl" />
                      <div className="flex items-start justify-between">
                        <p className="text-xs font-semibold text-white/60">Card number</p>
                        <div className="flex gap-1.5 text-xl text-white/70">
                          <FaCcVisa /><FaCcMastercard /><FaCcAmex />
                        </div>
                      </div>
                      <p className="mt-2 font-mono text-lg tracking-widest sm:text-xl">{cardNumber || '•••• •••• •••• ••••'}</p>
                      <div className="mt-5 flex justify-between text-xs text-white/60">
                        <div>
                          <p className="uppercase">Card holder</p>
                          <p className="mt-0.5 font-mono text-sm text-white">Jane Doe</p>
                        </div>
                        <div className="text-right">
                          <p className="uppercase">Expires</p>
                          <p className="mt-0.5 font-mono text-sm text-white">{expiry || 'MM/YY'}</p>
                        </div>
                        <div className="text-right">
                          <p className="uppercase">CVC</p>
                          <p className="mt-0.5 font-mono text-sm text-white">{cvc ? '•••' : '•••'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-xs font-bold text-slate-500">Card number</label>
                        <input value={cardNumber} onChange={(e) => setCardNumber(formatCard(e.target.value))} placeholder="4242 4242 4242 4242" className="input-base font-mono" inputMode="numeric" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-500">Card holder name</label>
                        <input {...register('holder', { required: 'Card holder name is required' })} placeholder="Jane Doe" className="input-base" />
                        {errors.holder && <p className="mt-1 text-xs font-semibold text-accent-500">{errors.holder.message}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1.5 block text-xs font-bold text-slate-500">Expiry</label>
                          <input value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} placeholder="08/28" className="input-base font-mono" inputMode="numeric" />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-bold text-slate-500">CVC</label>
                          <input value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" className="input-base font-mono" inputMode="numeric" type="password" />
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-[11px] text-slate-400">Demo mode: use any card — e.g. 4242 4242 4242 4242.</p>
                  </form>
                )}

                {method === 'paypal' && (
                  <div className="text-center">
                    <FaPaypal className="mx-auto text-6xl text-blue-600" />
                    <p className="mt-4 font-display text-lg font-extrabold text-slate-900 dark:text-white">You'll be redirected to PayPal</p>
                    <p className="mt-2 text-sm text-slate-500">Pay securely with your PayPal balance or linked card.</p>
                  </div>
                )}

                {(method === 'jazzcash' || method === 'easypaisa') && (
                  <div className="text-center">
                    <FaMobileScreenButton className={cx('mx-auto text-6xl', method === 'jazzcash' ? 'text-red-600' : 'text-green-600')} />
                    <p className="mt-4 font-display text-lg font-extrabold text-slate-900 dark:text-white">{method === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} checkout</p>
                    <p className="mt-2 text-sm text-slate-500">A payment request will be sent to your mobile number for approval.</p>
                  </div>
                )}

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-500">Email for receipt</label>
                    <input {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })} placeholder="jane@example.com" className="input-base" />
                    {errors.email && <p className="mt-1 text-xs font-semibold text-accent-500">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-500">{isMobileWallet ? 'Mobile number' : 'Phone (optional)'}</label>
                    <input {...register('phone', isMobileWallet ? { required: 'Mobile number required' } : {})} placeholder={isMobileWallet ? '03XX XXXXXXX' : '+1 555 000 0000'} className="input-base" />
                    {errors.phone && <p className="mt-1 text-xs font-semibold text-accent-500">{errors.phone.message}</p>}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Order summary */}
          <aside className="h-fit lg:sticky lg:top-28">
            <div className="glass overflow-hidden rounded-3xl">
              <div className="relative h-40">
                <Img src={draft.item.image} seed="pay-item" alt={draft.title} className="h-full w-full object-cover" />
                <span className="badge-float left-3 top-3 bg-gradient-to-r from-brand-600 to-ocean-500 text-white">{draft.type.charAt(0).toUpperCase() + draft.type.slice(1)}</span>
              </div>
              <div className="p-5">
                <h3 className="line-clamp-1 font-display text-base font-extrabold text-slate-900 dark:text-white">{draft.title}</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{formatDate(draft.dates.start)}{draft.type === 'hotel' || draft.type === 'car' ? ` – ${formatDate(draft.dates.end)}` : ''} · {draft.guests} {draft.guests === 1 ? 'traveler' : 'travelers'}</p>
                <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 text-sm">
                  <p className="flex justify-between text-slate-500"><span>Subtotal</span><span className="font-bold text-slate-900 dark:text-white">{formatPrice(draft.unitPrice)}</span></p>
                  <p className="flex justify-between text-slate-500"><span>Service fee</span><span className="font-bold text-slate-900 dark:text-white">{formatPrice(draft.fee)}</span></p>
                  <p className="flex justify-between font-display text-lg font-extrabold"><span className="text-slate-900 dark:text-white">Total</span><span className="text-gradient">{formatPrice(draft.total)}</span></p>
                </div>
                <button form="pay-form" type="submit" onClick={() => { if (method !== 'card') handleSubmit(pay)() }} disabled={processing} className="btn-primary mt-5 w-full !py-4">
                  {processing ? (
                    <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Processing…</span>
                  ) : (
                    <span className="flex items-center gap-2"><FaLock /> Pay {formatPrice(draft.total)}</span>
                  )}
                </button>
                <p className="mt-3 text-center text-[11px] text-slate-400">By paying you agree to our Terms & Cancellation policy.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Confetti() {
  const colors = ['#6366f1', '#06b6d4', '#f43f5e', '#f59e0b', '#10b981', '#a855f7']
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ x: Math.random() * window.innerWidth, y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: window.innerHeight + 20, x: Math.random() * window.innerWidth, rotate: Math.random() * 720, opacity: 0 }}
          transition={{ duration: 2.5 + Math.random() * 2, delay: Math.random() * 1.2, ease: 'easeIn' }}
          className="absolute h-3 w-3 rounded-sm"
          style={{ backgroundColor: colors[i % colors.length] }}
        />
      ))}
    </div>
  )
}
