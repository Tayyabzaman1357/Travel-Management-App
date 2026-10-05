import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useCountUp } from '@/hooks/useCountUp'

export default function StatCounter({ value = 0, suffix = '', label = '', icon = null, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const count = useCountUp(value, { start: inView, duration: 1600 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="glass group flex flex-col items-center gap-2 rounded-3xl px-6 py-8 text-center card-hover"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/15 to-ocean-500/15 text-2xl text-brand-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
        {icon}
      </div>
      <p className="font-display text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
        {Math.round(count).toLocaleString()}
        {suffix}
      </p>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
    </motion.div>
  )
}
