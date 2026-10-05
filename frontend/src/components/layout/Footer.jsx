import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  FaPlaneDeparture,
  FaLocationDot, FaPhone, FaEnvelope, FaPaperPlane,
} from 'react-icons/fa6'
import { NAV_LINKS, MORE_LINKS } from '@/utils/constants'
import { useApp } from '@/context/AppContext'

export default function Footer() {
  const { t } = useApp()
  const [email, setEmail] = useState('')

  const subscribe = (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }
    setEmail('')
    toast.success('Subscribed! Check your inbox for exclusive deals 🎉')
  }

  return (
    <footer className="relative mt-20 bg-slate-950 text-slate-300">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-ocean-500/20 blur-3xl" />
      </div>

      <div className="container-x relative">
        {/* Newsletter banner */}
        <div className="relative -translate-y-1/2">
          <div className="glass-strong overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-brand-500 to-ocean-500 p-1 shadow-glow">
            <div className="flex flex-col items-center gap-5 rounded-[1.4rem] px-6 py-8 text-center md:flex-row md:justify-between md:text-left sm:px-10">
              <div>
                <h3 className="font-display text-2xl font-extrabold text-white sm:text-3xl">{t('travelMore')}</h3>
                <p className="mt-1 text-sm text-white/85">{t('subscribeText')}</p>
              </div>
              <form onSubmit={subscribe} className="flex w-full max-w-md items-center gap-2 rounded-full bg-white/15 p-1.5 backdrop-blur">
                <FaEnvelope className="ml-3 shrink-0 text-white/70" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('enterEmail')}
                  className="w-full bg-transparent text-sm text-white placeholder-white/60 outline-none"
                  aria-label="Email for newsletter"
                />
                <button type="submit" className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-white px-5 text-xs font-extrabold text-brand-600 transition-all hover:scale-105 active:scale-95">
                  {t('subscribe')} <FaPaperPlane />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main footer */}
        <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-ocean-500 text-lg text-white shadow-glow">
                <FaPlaneDeparture />
              </span>
              <span className="font-display text-xl font-extrabold text-white">Wander<span className="text-gradient">lust</span></span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Your premium travel companion. Book flights, hotels, tours, cars and cruises at unbeatable prices — with 24/7 support and the best deals guaranteed.
            </p>
            <div className="mt-5 space-y-2 text-sm text-slate-400">
              <p className="flex items-center gap-2"><FaLocationDot className="text-brand-400" /> 88 Harbor Avenue, New York, NY</p>
              <p className="flex items-center gap-2"><FaPhone className="text-brand-400" /> +1 (800) 123-4567</p>
              <p className="flex items-center gap-2"><FaEnvelope className="text-brand-400" /> support@wanderlust.com</p>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-extrabold uppercase tracking-wider text-white">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="text-slate-400 transition-colors hover:text-brand-300">{l.label}</Link>
                </li>
              ))}
              <li><Link to="/destinations" className="text-slate-400 transition-colors hover:text-brand-300">Destinations</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-extrabold uppercase tracking-wider text-white">Services</h4>
            <ul className="space-y-2.5 text-sm">
              {MORE_LINKS.map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="text-slate-400 transition-colors hover:text-brand-300">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-extrabold uppercase tracking-wider text-white">Why Wanderlust</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>Best price guarantee on 400k+ stays</li>
              <li>Free cancellation on most bookings</li>
              <li>24/7 multilingual customer support</li>
              <li>Secure payments, PCI-DSS compliant</li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-lg bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-slate-300">Visa</span>
              <span className="rounded-lg bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-slate-300">Mastercard</span>
              <span className="rounded-lg bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-slate-300">PayPal</span>
              <span className="rounded-lg bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-slate-300">Apple Pay</span>
            </div>
          </div>
        </div>

        <div className="divider-gradient" />
        <div className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 Wanderlust Travels Inc. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-300">Privacy Policy</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-300">Terms of Service</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-300">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
