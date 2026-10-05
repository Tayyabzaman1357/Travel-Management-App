import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaUsers, FaGear, FaGasPump } from 'react-icons/fa6'
import Img from '@/components/common/Img'
import Rating from '@/components/common/Rating'
import WishlistButton from '@/components/common/WishlistButton'
import { useApp } from '@/context/AppContext'

export default function CarCard({ car, index = 0 }) {
  const { formatPrice } = useApp()
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group"
    >
      <Link to={`/booking?type=car&id=${car.id}`} className="glass flex h-full flex-col overflow-hidden rounded-3xl card-hover">
        <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Img src={car.image} seed={`car-${car.id}`} alt={car.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <WishlistButton item={car} type="car" className="absolute right-3 top-3" />
          <span className="badge-float left-3 top-3 bg-brand-600 text-white">{car.type}</span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-300">
                {car.name}
              </h3>
              <Rating value={car.rating} count={car.reviews} className="mt-1" size="xs" />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 px-2 py-2"><FaUsers className="text-brand-500" /> {car.seats} Seats</span>
            <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 px-2 py-2"><FaGear className="text-brand-500" /> {car.transmission}</span>
            <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 px-2 py-2"><FaGasPump className="text-brand-500" /> {car.fuel}</span>
          </div>
          <div className="mt-4 flex items-end justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
            <div>
              <p className="text-[11px] font-medium text-slate-400">Per day</p>
              <p className="font-display text-xl font-extrabold text-slate-900 dark:text-white">{formatPrice(car.pricePerDay)}</p>
            </div>
            <span className="rounded-full bg-gradient-to-r from-brand-600 to-ocean-500 px-5 py-2.5 text-xs font-bold text-white shadow-glow transition-transform duration-300 group-hover:scale-105">
              Rent Now
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
