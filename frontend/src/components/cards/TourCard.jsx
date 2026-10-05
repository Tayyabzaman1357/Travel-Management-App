import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaClock, FaPersonWalking } from 'react-icons/fa6'
import Img from '@/components/common/Img'
import Rating from '@/components/common/Rating'
import WishlistButton from '@/components/common/WishlistButton'
import { useApp } from '@/context/AppContext'
import { tourTypeLabels } from '@/data/tours'

export default function TourCard({ tour, index = 0 }) {
  const { formatPrice } = useApp()
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group"
    >
      <Link to={`/booking?type=tour&id=${tour.id}`} className="glass flex h-full flex-col overflow-hidden rounded-3xl card-hover">
        <div className="relative h-52 overflow-hidden">
          <Img src={tour.image} seed={`tour-${tour.id}`} alt={tour.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <span className="badge-float left-3 top-3 bg-gradient-to-r from-brand-600 to-ocean-500 text-white">
            {tourTypeLabels[tour.type]?.replace(' Tours', '') || tour.type}
          </span>
          <WishlistButton item={tour} type="tour" className="absolute right-3 top-3" />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-300">
            {tour.name}
          </h3>
          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{tour.destination}</p>
          <Rating value={tour.rating} count={tour.reviews} className="mt-2" />
          <div className="mt-3 flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><FaClock className="text-brand-500" /> {tour.duration}</span>
            <span className="flex items-center gap-1.5"><FaPersonWalking className="text-brand-500" /> Max {tour.groupSize}</span>
          </div>
          <div className="mt-4 flex items-end justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
            <div>
              <p className="text-[11px] font-medium text-slate-400">Per person</p>
              <p className="font-display text-xl font-extrabold text-slate-900 dark:text-white">
                {formatPrice(tour.price)}
                {tour.oldPrice && <span className="ml-2 text-sm font-semibold text-slate-400 line-through">{formatPrice(tour.oldPrice)}</span>}
              </p>
            </div>
            <span className="rounded-full bg-gradient-to-r from-brand-600 to-ocean-500 px-5 py-2.5 text-xs font-bold text-white shadow-glow transition-transform duration-300 group-hover:scale-105">
              Book Tour
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
