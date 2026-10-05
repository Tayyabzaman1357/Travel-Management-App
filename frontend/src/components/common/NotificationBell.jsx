import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBell, FaXmark, FaCheckDouble } from 'react-icons/fa6'
import { useNotifications } from '@/context/NotificationContext'
import { useClickOutside } from '@/hooks/useClickOutside'
import { timeAgo } from '@/utils/format'
import { cx } from '@/utils/helpers'

const icons = {
  booking: '🎉',
  offer: '🏷️',
  info: '✈️',
  alert: '⚠️',
}

export default function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead, remove } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useClickOutside(() => setOpen(false))

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-700 backdrop-blur transition-all hover:scale-105 hover:text-brand-600"
        aria-label="Notifications"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-extrabold text-white shadow-glow-accent">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="glass-strong absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl sm:w-96"
          >
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 px-4 py-3">
              <p className="font-display text-sm font-extrabold text-slate-900 dark:text-white">Notifications</p>
              <button onClick={markAllRead} className="flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-300 hover:underline">
                <FaCheckDouble /> Mark all read
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">No notifications yet.</p>
              )}
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={cx(
                    'group flex cursor-pointer gap-3 border-b border-slate-100 dark:border-slate-800/60 px-4 py-3 transition-colors hover:bg-brand-500/5',
                    !n.read && 'bg-brand-500/5'
                  )}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500/15 to-ocean-500/15 text-lg">
                    {icons[n.type] || '🔔'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cx('text-xs font-bold', n.read ? 'text-slate-600 dark:text-slate-300' : 'text-slate-900 dark:text-white')}>{n.title}</p>
                      <span className="shrink-0 text-[10px] text-slate-400">{timeAgo(n.date)}</span>
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{n.message}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      remove(n.id)
                    }}
                    className="self-center text-slate-300 opacity-0 transition-all group-hover:opacity-100 hover:text-accent-500"
                    aria-label="Dismiss"
                  >
                    <FaXmark />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
