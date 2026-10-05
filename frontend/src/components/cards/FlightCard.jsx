import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowRightLong, FaClock, FaPerson } from 'react-icons/fa6'
import { getAirline, getAirport, flightImage } from '@/data/flights'
import { formatTime, formatDuration } from '@/utils/format'
import { useApp } from '@/context/AppContext'
import Img from '@/components/common/Img'
import { cx } from '@/utils/helpers'

export default function FlightCard({ flight, index = 0, onBook = null, selected = false, onSelect = null }) {
  const { formatPrice } = useApp()
  const airline = getAirline(flight.airline)
  const fromAp = getAirport(flight.fromCode)
  const toAp = getAirport(flight.toCode)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.05 }}
      onClick={onSelect}
      className={cx(
        'glass cursor-pointer overflow-hidden rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg sm:p-6',
        selected && 'ring-2 ring-brand-500 shadow-glow'
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4 lg:w-56">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
            <Img src={flightImage(flight.airline)} seed={`air-${flight.airline}`} alt={airline?.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="font-display text-sm font-extrabold text-slate-900 dark:text-white">
              {airline?.name || flight.airline}
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {flight.flightNo} · {flight.class}
            </p>
            <span className={cx('chip mt-1', flight.stops === 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400')}>
              {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-between gap-4">
          <div className="text-center">
            <p className="font-display text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">{formatTime(flight.departTime)}</p>
            <p className="text-xs font-semibold text-slate-500">{flight.fromCode}</p>
            <p className="text-[11px] text-slate-400">{fromAp?.city}</p>
          </div>
          <div className="flex flex-1 flex-col items-center px-2">
            <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-slate-400">
              <FaClock /> {formatDuration(flight.duration)}
            </p>
            <div className="relative flex w-full max-w-[160px] items-center">
              <span className="h-0.5 flex-1 rounded bg-gradient-to-r from-brand-500 to-ocean-500" />
              <span className="mx-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-300">
                <FaArrowRightLong className="text-xs" />
              </span>
              <span className="h-0.5 flex-1 rounded bg-gradient-to-r from-ocean-500 to-brand-500" />
            </div>
            <p className="mt-1 text-[11px] font-medium text-slate-400">{flight.date}</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">{formatTime(flight.arriveTime)}</p>
            <p className="text-xs font-semibold text-slate-500">{flight.toCode}</p>
            <p className="text-[11px] text-slate-400">{toAp?.city}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 lg:w-48 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">{formatPrice(flight.price)}</p>
          <p className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <FaPerson /> {flight.seatsLeft} seats left
          </p>
          <Link
            to={`/booking?type=flight&id=${flight.id}`}
            onClick={(e) => e.stopPropagation()}
            className={cx(
              'w-full rounded-full px-5 py-2.5 text-center text-xs font-bold transition-all duration-300',
              flight.seatsLeft <= 8
                ? 'bg-accent-500 text-white shadow-glow-accent hover:brightness-110'
                : 'bg-gradient-to-r from-brand-600 to-ocean-500 text-white shadow-glow hover:brightness-110'
            )}
          >
            Book Flight
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
