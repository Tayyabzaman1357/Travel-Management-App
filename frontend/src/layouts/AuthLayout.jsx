import { Link, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaPlaneDeparture, FaStar, FaShieldHalved, FaHeadset } from 'react-icons/fa6'
import { imgUrl, IMG } from '@/data/images'

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden lg:block">
        <img src={imgUrl(IMG.santoriniSunset, 1200)} alt="Travel" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950/90 via-brand-900/70 to-slate-950/90" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-ocean-500 text-xl text-white shadow-glow">
              <FaPlaneDeparture />
            </span>
            <span className="font-display text-2xl font-extrabold text-white">Wander<span className="text-gradient">lust</span></span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="max-w-md font-display text-4xl font-extrabold leading-tight text-white">
              Your next adventure starts <span className="text-gradient">here.</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
              Join 250,000+ travelers booking flights, hotels, tours and cruises with Wanderlust — the smartest way to explore the world.
            </p>
            <div className="mt-8 space-y-3">
              {[
                { icon: <FaStar />, text: 'Best price guarantee on 400k+ stays' },
                { icon: <FaShieldHalved />, text: 'Free cancellation on most bookings' },
                { icon: <FaHeadset />, text: '24/7 human support in 8 languages' },
              ].map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="flex items-center gap-3 text-sm text-white/90">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-brand-300 backdrop-blur">{f.icon}</span>
                  {f.text}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <p className="text-xs text-white/50">© 2026 Wanderlust Travels Inc. All rights reserved.</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-8">
        <div className="absolute inset-0 bg-grid opacity-50 dark:opacity-20" />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold text-slate-900 dark:text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-ocean-500 text-sm text-white"><FaPlaneDeparture /></span>
              Wander<span className="text-gradient">lust</span>
            </Link>
          </div>
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}
