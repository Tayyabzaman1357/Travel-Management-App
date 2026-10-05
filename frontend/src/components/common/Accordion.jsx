import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaMinus } from 'react-icons/fa6'
import { cx } from '@/utils/helpers'

export default function Accordion({ items = [], defaultOpen = 0, className = '' }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={cx('space-y-3', className)}>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div
            key={i}
            className={cx(
              'overflow-hidden rounded-2xl border transition-all duration-300',
              isOpen
                ? 'border-brand-300/60 dark:border-brand-500/40 bg-white dark:bg-slate-900 shadow-soft'
                : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 hover:border-brand-200 dark:hover:border-slate-700'
            )}
          >
            <button
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
            >
              <span className="font-display text-sm font-bold text-slate-800 dark:text-slate-100 sm:text-base">{item.q}</span>
              <span
                className={cx(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs transition-all duration-300',
                  isOpen ? 'bg-gradient-to-r from-brand-600 to-ocean-500 text-white rotate-180' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300'
                )}
              >
                {isOpen ? <FaMinus /> : <FaPlus />}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
