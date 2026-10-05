import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa6'
import { cx } from '@/utils/helpers'

export default function SectionHeading({ eyebrow, title, subtitle, action, to, center = false, className = '' }) {
  return (
    <div className={cx('mb-10 flex flex-col gap-4', center ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className={cx('max-w-2xl', center && 'mx-auto')}>
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="chip bg-brand-500/10 text-brand-600 dark:text-brand-300 mb-3 uppercase tracking-wider"
          >
            {eyebrow}
          </motion.span>
        )}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      {action && (
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <Link
            to={to || '#'}
            className="group inline-flex items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-300 transition-colors hover:text-brand-700"
          >
            {action}
            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      )}
    </div>
  )
}
