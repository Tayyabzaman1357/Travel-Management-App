import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaPlaneDeparture } from 'react-icons/fa6'
import { useSEO } from '@/utils/seo'

export default function NotFound() {
  useSEO('Page Not Found — Wanderlust', 'The page you are looking for has flown away.')
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50 via-white to-ocean-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-40 dark:opacity-10" />
      <motion.div
        animate={{ x: [0, 30, -30, 0], y: [0, -10, 10, 0], rotate: [0, 8, -8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="text-7xl text-brand-500"
      >
        <FaPlaneDeparture />
      </motion.div>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 font-display text-8xl font-extrabold text-gradient">
        404
      </motion.p>
      <h1 className="mt-2 font-display text-2xl font-extrabold text-slate-900 dark:text-white">This page took a wrong flight</h1>
      <p className="mt-3 max-w-md text-sm text-slate-500 dark:text-slate-400">
        The page you're looking for doesn't exist or has been moved. Let's get you back to your journey.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/" className="btn-primary">Back to home</Link>
        <Link to="/destinations" className="btn-outline">Explore destinations</Link>
      </div>
    </div>
  )
}
