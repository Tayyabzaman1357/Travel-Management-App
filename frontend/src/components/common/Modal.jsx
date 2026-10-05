import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaXmark } from 'react-icons/fa6'

export default function Modal({ open, onClose, children, title, size = 'md', className = '' }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    if (open) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={`glass-strong max-h-[92vh] w-full overflow-y-auto rounded-t-3xl sm:rounded-3xl ${sizes[size]} ${className}`}
            role="dialog"
            aria-modal="true"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 px-6 py-4 backdrop-blur-xl">
              <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">{title}</h3>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 transition-all hover:rotate-90 hover:bg-accent-500 hover:text-white"
                aria-label="Close"
              >
                <FaXmark />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
