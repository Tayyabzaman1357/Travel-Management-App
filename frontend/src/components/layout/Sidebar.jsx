import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaPlaneDeparture, FaBars, FaXmark, FaArrowLeft } from 'react-icons/fa6'
import { useAuth } from '@/context/AuthContext'
import { cx } from '@/utils/helpers'
import { initials } from '@/utils/format'

export default function Sidebar({ items, activeKey, onChange, title = 'Dashboard' }) {
  const { user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 px-5 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold text-slate-900 dark:text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-ocean-500 text-sm text-white">
            <FaPlaneDeparture />
          </span>
          Wanderlust
        </Link>
        <button onClick={() => setMobileOpen(false)} className="rounded-full bg-slate-100 p-2 text-slate-500 lg:hidden" aria-label="Close sidebar">
          <FaXmark />
        </button>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto p-3">
        <p className="px-3 pb-1 pt-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{title}</p>
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              onChange(item.key)
              setMobileOpen(false)
            }}
            className={cx(
              'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200',
              activeKey === item.key
                ? 'bg-gradient-to-r from-brand-600 to-ocean-500 text-white shadow-glow'
                : 'text-slate-600 dark:text-slate-300 hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-300'
            )}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
            {item.badge > 0 && (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-extrabold text-white">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="border-t border-slate-200/60 dark:border-slate-800 p-4">
        <Link to="/" className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 transition-colors hover:text-brand-600">
          <FaArrowLeft /> Back to website
        </Link>
        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 p-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-ocean-500 text-xs font-extrabold text-white">
            {user?.photoURL ? <img src={user.photoURL} alt="" className="h-full w-full rounded-full object-cover" /> : initials(user?.name || 'U')}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{user?.name}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] w-72 shrink-0 overflow-hidden rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-soft lg:block">
        {content}
      </aside>

      {/* Mobile */}
      <div className="mb-4 lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="glass flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200"
        >
          <FaBars /> Menu · {items.find((i) => i.key === activeKey)?.label || title}
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[95] bg-slate-950/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-[96] w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
