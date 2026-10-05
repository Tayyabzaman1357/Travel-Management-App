import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaLocationDot } from 'react-icons/fa6'
import Img from '@/components/common/Img'
import Rating, { ScoreBadge } from '@/components/common/Rating'
import WishlistButton from '@/components/common/WishlistButton'
import { useApp } from '@/context/AppContext'
import { HOTEL_AMENITIES } from '@/data/hotels'

const amenityIcon = (key) => HOTEL_AMENITIES.find((a) => a.key === key)

export default function HotelCard({ hotel, index = 0 }) {
  const { formatPrice } = useApp()
  const topAmenities = (hotel.amenities || []).slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group"
    >
      <Link
        to={`/booking?type=hotel&id=${hotel.id}`}
        className="glass flex h-full flex-col overflow-hidden rounded-3xl card-hover"
      >
        <div className="relative h-52 overflow-hidden">
          <Img src={hotel.image} seed={`hotel-${hotel.id}`} alt={hotel.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <WishlistButton item={hotel} type="hotel" className="absolute right-3 top-3" />
          {hotel.oldPrice && (
            <span className="badge-float left-3 top-3 bg-accent-500 text-white">
              Save {Math.round(((hotel.oldPrice - hotel.price) / hotel.oldPrice) * 100)}%
            </span>
          )}
          <span className="absolute bottom-3 right-3"><ScoreBadge value={hotel.rating} /></span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            <FaLocationDot className="text-brand-500" /> {hotel.city}, {hotel.country}
          </p>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-300">
            {hotel.name}
          </h3>
          <Rating value={hotel.rating} count={hotel.reviews} className="mt-2" showLabel />
          <div className="mt-3 flex items-center gap-3">
            {topAmenities.map((a) => {
              const meta = amenityIcon(a)
              const emoji = emojiFor(a)
              return meta && emoji ? (
                <span key={a} title={meta.label} className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/8 text-sm text-brand-600 dark:text-brand-300">
                  <span>{emoji}</span>
                </span>
              ) : null
            })}
            {hotel.amenities?.length > 3 && (
              <span className="text-xs font-semibold text-slate-400">+{hotel.amenities.length - 3} more</span>
            )}
          </div>
          <div className="mt-4 flex items-end justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
            <div>
              <p className="text-[11px] font-medium text-slate-400">Per night</p>
              <p className="font-display text-xl font-extrabold text-slate-900 dark:text-white">
                {formatPrice(hotel.price)}
                {hotel.oldPrice && <span className="ml-2 text-sm font-semibold text-slate-400 line-through">{formatPrice(hotel.oldPrice)}</span>}
              </p>
            </div>
            <span className="rounded-full bg-gradient-to-r from-brand-600 to-ocean-500 px-5 py-2.5 text-xs font-bold text-white shadow-glow transition-transform duration-300 group-hover:scale-105">
              Book Now
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function emojiFor(key) {
  const map = {
    pool: '🏊', wifi: '📶', parking: '🅿️', restaurant: '🍽️', spa: '💆', gym: '🏋️',
    breakfast: '☕', ac: '❄️', bar: '🍸', beach: '🏖️', pets: '🐾', laundry: '🧺', airport: '🚌',
  }
  return map[key] || null
}
