import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaMoon } from 'react-icons/fa6'
import Img from '@/components/common/Img'
import Rating from '@/components/common/Rating'
import WishlistButton from '@/components/common/WishlistButton'
import { useApp } from '@/context/AppContext'
import { emojiFor } from './HotelCard'

export default function CruiseCard({ cruise, index = 0 }) {
  const { formatPrice } = useApp()
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group"
    >
      <Link to={`/booking?type=cruise&id=${cruise.id}`} className="glass flex h-full flex-col overflow-hidden rounded-3xl card-hover">
        <div className="relative h-52 overflow-hidden">
          <Img src={cruise.image} seed={`cruise-${cruise.id}`} alt={cruise.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <span className="badge-float left-3 top-3 bg-gradient-to-r from-brand-600 to-ocean-500 text-white">{cruise.type}</span>
          <WishlistButton item={cruise} type="cruise" className="absolute right-3 top-3" />
          <span className="badge-float bottom-3 right-3">
            <FaMoon className="text-brand-500" /> {cruise.nights} Nights
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-300">
            {cruise.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-500 dark:text-slate-400">{cruise.destination}</p>
          <div className="mt-2 flex items-center justify-between">
            <Rating value={cruise.rating} count={cruise.reviews} size="xs" />
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{cruise.ship}</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            {(cruise.amenities || []).slice(0, 4).map((a) => {
              const emoji = emojiFor(a)
              return emoji ? (
                <span key={a} title={a} className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/8 text-xs">{emoji}</span>
              ) : null
            })}
          </div>
          <div className="mt-4 flex items-end justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
            <div>
              <p className="text-[11px] font-medium text-slate-400">Per person</p>
              <p className="font-display text-xl font-extrabold text-slate-900 dark:text-white">
                {formatPrice(cruise.price)}
                {cruise.oldPrice && <span className="ml-2 text-sm font-semibold text-slate-400 line-through">{formatPrice(cruise.oldPrice)}</span>}
              </p>
            </div>
            <span className="rounded-full bg-gradient-to-r from-brand-600 to-ocean-500 px-5 py-2.5 text-xs font-bold text-white shadow-glow transition-transform duration-300 group-hover:scale-105">
              Book Cruise
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
