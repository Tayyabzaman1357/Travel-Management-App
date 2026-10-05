import { motion } from 'framer-motion'
import Img from '@/components/common/Img'
import Rating from '@/components/common/Rating'

export default function TestimonialCard({ testimonial, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06 }}
      className="glass relative flex h-full flex-col rounded-3xl p-6 card-hover"
    >
      <Rating value={testimonial.rating} size="sm" />
      <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">“{testimonial.text}”</p>
      <div className="mt-6 flex items-center gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
        <Img src={testimonial.avatar} seed={`tm-${testimonial.id}`} alt={testimonial.name} className="h-11 w-11 rounded-full object-cover ring-2 ring-brand-500/30" />
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-900 dark:text-white">{testimonial.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{testimonial.location}</p>
        </div>
        <span className="chip bg-brand-500/10 text-brand-600 dark:text-brand-300">{testimonial.trip}</span>
      </div>
    </motion.div>
  )
}
