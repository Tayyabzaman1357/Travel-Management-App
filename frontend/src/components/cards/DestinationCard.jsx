import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaLocationDot, FaArrowRight } from 'react-icons/fa6'
import Img from '@/components/common/Img'
import Rating from '@/components/common/Rating'
import WishlistButton from '@/components/common/WishlistButton'
import { useApp } from '@/context/AppContext'

export default function DestinationCard({ destination, index = 0 }) {
  const { formatPrice } = useApp()
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
    >
      <Link
        to={`/destinations/${destination.id}`}
        className="group relative block overflow-hidden rounded-3xl shadow-soft transition-all duration-500 hover:shadow-soft-lg"
      >
        <Img
          src={destination.image}
          seed={`dest-${destination.id}`}
          alt={destination.name}
          className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
        <WishlistButton item={destination} type="destination" className="absolute right-4 top-4" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-white/85">
              <FaLocationDot className="text-ocean-400" /> {destination.country}
            </span>
            <Rating value={destination.rating} count={destination.reviews} size="xs" />
          </div>
          <h3 className="font-display text-2xl font-extrabold text-white">{destination.name}</h3>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-white/90">
              From <span className="font-display text-lg font-extrabold text-amber-300">{formatPrice(destination.price)}</span>
            </p>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-brand-600 group-hover:to-ocean-500 group-hover:translate-x-1">
              <FaArrowRight />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
