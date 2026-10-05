import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaBed, FaMapLocationDot, FaBorderAll, FaSliders, FaXmark } from 'react-icons/fa6'
import HotelCard from '@/components/cards/HotelCard'
import Breadcrumb from '@/components/common/Breadcrumb'
import Pagination from '@/components/common/Pagination'
import EmptyState from '@/components/common/EmptyState'
import MapView from '@/components/common/MapView'
import { PageLoader } from '@/components/common/Skeletons'
import { HOTEL_AMENITIES } from '@/data/hotels'
import { useCatalog } from '@/context/CatalogContext'
import { useApp } from '@/context/AppContext'
import { nextDays, addDays, nightsBetween } from '@/utils/format'
import { useSEO } from '@/utils/seo'
import { cx } from '@/utils/helpers'

const PAGE_SIZE = 9

export default function Hotels() {
  const [params] = useSearchParams()
  const { formatPrice } = useApp()
  const { hotels, loading: catalogLoading } = useCatalog()
  useSEO('Hotels & Stays — Wanderlust', 'Book hotels, resorts and villas with free cancellation and best price guarantee.')

  const [dest, setDest] = useState(params.get('dest') || '')
  const [checkIn, setCheckIn] = useState(params.get('checkIn') || nextDays(21))
  const [checkOut, setCheckOut] = useState(params.get('checkOut') || nextDays(24))
  const [guests, setGuests] = useState(Number(params.get('guests')) || 2)
  const [rooms, setRooms] = useState(Number(params.get('rooms')) || 1)

  const [maxPrice, setMaxPrice] = useState(1000)
  const [minRating, setMinRating] = useState(0)
  const [amenityFilter, setAmenityFilter] = useState([])
  const [sort, setSort] = useState('recommended')
  const [view, setView] = useState('grid')
  const [page, setPage] = useState(1)

  useEffect(() => setPage(1), [dest, maxPrice, minRating, amenityFilter, sort, checkIn, checkOut])

  const results = useMemo(() => {
    let list = hotels.filter((h) => {
      if (dest && !(h.city.toLowerCase().includes(dest.toLowerCase()) || h.country.toLowerCase().includes(dest.toLowerCase()) || h.name.toLowerCase().includes(dest.toLowerCase()))) return false
      if (h.price > maxPrice) return false
      if (h.rating < minRating) return false
      if (amenityFilter.length && !amenityFilter.every((a) => (h.amenities || []).includes(a))) return false
      return true
    })
    switch (sort) {
      case 'price-asc': list = [...list].sort((a, b) => a.price - b.price); break
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break
      case 'rating': list = [...list].sort((a, b) => b.rating - a.rating); break
      default: list = [...list].sort((a, b) => b.reviews - a.reviews)
    }
    return list
  }, [dest, maxPrice, minRating, amenityFilter, sort])

  const totalPages = Math.ceil(results.length / PAGE_SIZE)
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const nights = nightsBetween(checkIn, checkOut)
  const priceCeiling = (hotels.length ? Math.max(...hotels.map((h) => h.price)) : 1000) + 100

  const toggleAmenity = (key) => setAmenityFilter((prev) => (prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]))

  if (catalogLoading) {
    return <div className="container-x pt-40"><PageLoader /></div>
  }

  return (
    <div className="pt-28">
      {/* Search form */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-ocean-500 pb-12">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="container-x relative">
          <div className="mb-6"><Breadcrumb items={[{ label: 'Hotels' }]} /></div>
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">Find Your Perfect Stay</h1>
          <p className="mt-2 text-sm text-white/85">400k+ hotels, resorts and villas with free cancellation on most bookings.</p>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="glass-strong mt-6 rounded-3xl p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
              <div>
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Destination</label>
                <input value={dest} onChange={(e) => setDest(e.target.value)} placeholder="Where to?" className="input-base" />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Check In</label>
                <input type="date" min={nextDays(0)} value={checkIn} onChange={(e) => { setCheckIn(e.target.value); if (e.target.value >= checkOut) setCheckOut(addDays(e.target.value, 3)) }} className="input-base" />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Check Out</label>
                <input type="date" min={addDays(checkIn, 1)} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="input-base" />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Guests</label>
                <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="input-base">
                  {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Rooms</label>
                <select value={rooms} onChange={(e) => setRooms(Number(e.target.value))} className="input-base">
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} room{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-x py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters */}
          <aside className="h-fit space-y-6 lg:sticky lg:top-28">
            <div className="glass rounded-3xl p-5">
              <p className="mb-4 flex items-center gap-2 font-display text-sm font-extrabold text-slate-900 dark:text-white">
                <FaSliders className="text-brand-500" /> Filters
                <button onClick={() => { setMaxPrice(priceCeiling); setMinRating(0); setAmenityFilter([]) }} className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-accent-500 hover:underline">
                  <FaXmark /> Reset
                </button>
              </p>

              <div className="mb-5">
                <p className="mb-2 text-xs font-bold text-slate-500">Price per night</p>
                <input type="range" min={50} max={priceCeiling} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-brand-600" />
                <p className="mt-1 text-[11px] font-semibold text-slate-400">Up to {formatPrice(maxPrice)}</p>
              </div>

              <div className="mb-5">
                <p className="mb-2 text-xs font-bold text-slate-500">Guest rating</p>
                <div className="flex flex-wrap gap-2">
                  {[0, 4, 4.5, 4.7].map((r) => (
                    <button key={r} onClick={() => setMinRating(r)} className={cx('rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all', minRating === r ? 'border-transparent bg-gradient-to-r from-brand-600 to-ocean-500 text-white' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-brand-400')}>
                      {r === 0 ? 'Any' : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-bold text-slate-500">Amenities</p>
                <div className="grid grid-cols-1 gap-1">
                  {HOTEL_AMENITIES.map((a) => (
                    <label key={a.key} className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors hover:bg-brand-500/8">
                      <input type="checkbox" checked={amenityFilter.includes(a.key)} onChange={() => toggleAmenity(a.key)} className="h-4 w-4 accent-brand-600" />
                      <span>{a.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {results.length} stays · {nights} night{nights > 1 ? 's' : ''} · {guests} guest{guests > 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex rounded-full bg-slate-100 dark:bg-slate-800/70 p-1">
                  <button onClick={() => setView('grid')} className={cx('rounded-full px-3 py-1.5 text-xs font-bold transition-all', view === 'grid' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-soft' : 'text-slate-500')} aria-label="Grid view"><FaBorderAll /></button>
                  <button onClick={() => setView('map')} className={cx('rounded-full px-3 py-1.5 text-xs font-bold transition-all', view === 'map' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-soft' : 'text-slate-500')} aria-label="Map view"><FaMapLocationDot /></button>
                </div>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-base !w-auto !py-2 text-xs font-bold">
                  <option value="recommended">Sort: Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Guest rating</option>
                </select>
              </div>
            </div>

            {results.length === 0 ? (
              <EmptyState icon={<FaBed />} title="No stays match your filters" text="Try adjusting the price range or removing some amenities." />
            ) : view === 'map' ? (
              <MapView
                className="h-[560px]"
                markers={results.map((h) => ({ position: [h.coords?.lat ?? 0, h.coords?.lng ?? 0], title: h.name, subtitle: `${h.city}, ${h.country}`, price: `${formatPrice(h.price)}/night` }))}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {pageItems.map((h, i) => <HotelCard key={h.id} hotel={h} index={i} />)}
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
