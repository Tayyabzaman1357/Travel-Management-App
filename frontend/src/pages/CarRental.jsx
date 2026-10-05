import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCar, FaLocationDot, FaXmark } from 'react-icons/fa6'
import CarCard from '@/components/cards/CarCard'
import Breadcrumb from '@/components/common/Breadcrumb'
import Pagination from '@/components/common/Pagination'
import EmptyState from '@/components/common/EmptyState'
import { cars, carTypes } from '@/data/cars'
import { useApp } from '@/context/AppContext'
import { useSEO } from '@/utils/seo'
import { nextDays, addDays } from '@/utils/format'
import { cx } from '@/utils/helpers'

const PAGE_SIZE = 6

export default function CarRental() {
  const { formatPrice } = useApp()
  useSEO('Car Rentals — Wanderlust', 'Rent SUVs, sedans, luxury and electric cars at unbeatable daily rates.')

  const [type, setType] = useState('All')
  const [pickup, setPickup] = useState('')
  const [maxPrice, setMaxPrice] = useState(400)
  const [transmission, setTransmission] = useState('Any')
  const [page, setPage] = useState(1)

  useEffect(() => setPage(1), [type, pickup, maxPrice, transmission])

  const results = useMemo(() => {
    let list = cars.filter((c) => {
      if (type !== 'All' && c.type !== type) return false
      if (maxPrice && c.pricePerDay > maxPrice) return false
      if (transmission !== 'Any' && c.transmission !== transmission) return false
      return true
    })
    return [...list].sort((a, b) => a.pricePerDay - b.pricePerDay)
  }, [type, pickup, maxPrice, transmission])

  const totalPages = Math.ceil(results.length / PAGE_SIZE)
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="pt-28">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-ocean-500 pb-14">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="container-x relative">
          <div className="mb-6"><Breadcrumb items={[{ label: 'Car Rentals' }]} /></div>
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">Rent a Car, Go Anywhere</h1>
          <p className="mt-2 text-sm text-white/85">SUVs, sedans, luxury and electric — with free cancellation up to 48 hours before pickup.</p>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="glass-strong mt-6 rounded-3xl p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Pickup Location</label>
                <div className="relative">
                  <FaLocationDot className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-500" />
                  <input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Airport or city" className="input-base !pl-10" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Pickup Date</label>
                <input type="date" min={nextDays(0)} defaultValue={nextDays(7)} className="input-base" />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Drop-off Date</label>
                <input type="date" min={nextDays(8)} defaultValue={nextDays(10)} className="input-base" />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Car Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="input-base">
                  <option>All</option>
                  {carTypes.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-x py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit space-y-6 lg:sticky lg:top-28">
            <div className="glass rounded-3xl p-5">
              <p className="mb-4 flex items-center justify-between font-display text-sm font-extrabold text-slate-900 dark:text-white">
                Filters
                <button onClick={() => { setType('All'); setMaxPrice(400); setTransmission('Any') }} className="flex items-center gap-1 text-[11px] font-semibold text-accent-500 hover:underline"><FaXmark /> Reset</button>
              </p>
              <div className="mb-5">
                <p className="mb-2 text-xs font-bold text-slate-500">Max daily rate</p>
                <input type="range" min={40} max={400} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-brand-600" />
                <p className="mt-1 text-[11px] font-semibold text-slate-400">Up to {formatPrice(maxPrice)}/day</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold text-slate-500">Transmission</p>
                <div className="flex flex-col gap-1.5">
                  {['Any', 'Automatic', 'Manual'].map((t) => (
                    <label key={t} className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-brand-500/8">
                      <input type="radio" name="trans" checked={transmission === t} onChange={() => setTransmission(t)} className="h-4 w-4 accent-brand-600" /> {t}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">{results.length} cars available</p>
              <div className="flex flex-wrap gap-2">
                {carTypes.map((t) => (
                  <button key={t} onClick={() => setType(t)} className={cx('chip transition-all', type === t ? 'bg-gradient-to-r from-brand-600 to-ocean-500 text-white shadow-glow' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700')}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {results.length === 0 ? (
              <EmptyState icon={<FaCar />} title="No cars match your filters" text="Try lowering the price cap or clearing filters." />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {pageItems.map((c, i) => <CarCard key={c.id} car={c} index={i} />)}
                </div>
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
