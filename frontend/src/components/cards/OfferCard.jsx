import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FaRegCopy, FaTag, FaFire } from 'react-icons/fa6'
import Img from '@/components/common/Img'
import { formatDate } from '@/utils/format'

export default function OfferCard({ offer, index = 0 }) {
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(offer.code)
      toast.success(`Coupon ${offer.code} copied to clipboard!`)
    } catch {
      toast.success(`Use code: ${offer.code}`)
    }
  }

  const typeStyle =
    offer.type === 'Coupon'
      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300'
      : offer.type === 'Promo'
      ? 'bg-ocean-500/10 text-ocean-600 dark:text-ocean-400'
      : 'bg-accent-500/10 text-accent-600 dark:text-accent-400'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06 }}
      className="glass group relative flex flex-col overflow-hidden rounded-3xl card-hover"
    >
      <div className="relative h-36 overflow-hidden">
        <Img src={offer.image} seed={`offer-${offer.id}`} alt={offer.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-extrabold text-slate-900 backdrop-blur">
          <FaFire className="text-accent-500" /> {offer.discount}% OFF
        </span>
        <span className={`chip absolute bottom-3 left-3 backdrop-blur-md ${typeStyle} bg-white/80 dark:bg-slate-900/80`}>{offer.type}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{offer.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <FaTag className="text-brand-500" /> {offer.category}
        </p>
        <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{offer.description}</p>
        <button
          onClick={copyCode}
          className="mt-4 flex w-full items-center justify-between rounded-2xl border-2 border-dashed border-brand-400/60 bg-brand-500/5 px-4 py-3 transition-all duration-300 hover:bg-brand-500/10 active:scale-[0.98]"
        >
          <span className="font-display text-lg font-extrabold tracking-widest text-brand-600 dark:text-brand-300">{offer.code}</span>
          <span className="flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-300">
            <FaRegCopy /> Copy
          </span>
        </button>
        <p className="mt-3 text-center text-[11px] text-slate-400">Valid until {formatDate(offer.expiry)}</p>
      </div>
    </motion.div>
  )
}
