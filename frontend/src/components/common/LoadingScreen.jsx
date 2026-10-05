import { motion } from 'framer-motion'
import { FaPlaneDeparture } from 'react-icons/fa6'

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-50 via-brand-50 to-ocean-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-600 to-ocean-500 text-3xl text-white shadow-glow"
      >
        <FaPlaneDeparture />
      </motion.div>
      <div className="font-display text-2xl font-extrabold tracking-tight">
        <span className="text-gradient">Wanderlust</span>
      </div>
      <div className="h-1 w-40 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-600 to-ocean-500"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">Preparing your journey…</p>
    </motion.div>
  )
}
