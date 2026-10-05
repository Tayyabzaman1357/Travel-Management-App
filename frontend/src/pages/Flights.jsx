import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaPlaneDeparture, FaArrowRightArrowLeft, FaSliders, FaXmark } from 'react-icons/fa6'
import FlightCard from '@/components/cards/FlightCard'
import Breadcrumb from '@/components/common/Breadcrumb'
import Pagination from '@/components/common/Pagination'
import EmptyState from '@/components/common/EmptyState'
import { PageLoader } from '@/components/common/Skeletons'
import { airlines, findAirport, airports } from '@/data/flights'
import { useCatalog } from '@/context/CatalogContext'
import { useApp } from '@/context/AppContext'
import { formatDuration, nextDays, addDays } from '@/utils/format'
import { useSEO } from '@/utils/seo'
import { cx } from '@/utils/helpers'

const PAGE_SIZE = 6

export default function Flights() {
  const [params, setParams] = useSearchParams()
  const { formatPrice, convert } = useApp()
  const { flights, loading: catalogLoading } = useCatalog()
  useSEO('Search Flights — Wanderlust', 'Compare and book flights to 120+ destinations with the best price guarantee.')

  // Form state (initialised from URL query)
  const [from, setFrom] = useState(params.get('from') || '')
  const [to, setTo] = useState(params.get('to') || '')
  const [trip, setTrip] = useState(params.get('ret') ? 'round' : 'one')
  const [depart, setDepart] = useState(params.get('depart') || nextDays(14))
  const [ret, setRet] = useState(params.get('ret') || nextDays(21))
  const [passengers, setPassengers] = useState(Number(params.get('passengers')) || 1)
  const [cls, setCls] = useState(params.get('class') || 'Economy')
  const [searched, setSearched] = useState(Boolean(params.get('from')))

  // Filters & sorting
  const [maxPrice, setMaxPrice] = useState(2000)
  const [airlineFilter, setAirlineFilter] = useState([])
  const [stopsFilter, setStopsFilter] = useState(null)
  const [maxDuration, setMaxDuration] = useState(1200)
  const [sort, setSort] = useState('recommended')

  // Pagination
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (searched) setPage(1)
  }, [searched, maxPrice, airlineFilter, stopsFilter, maxDuration, sort])

  const fromName = findAirport(from)[0]?.city || from
  const toName = findAirport(to)[0]?.city || to

  const results = useMemo(() => {
    let list = flights.filter((f) => {
      if (from && !(f.from.toLowerCase().includes(fromName.toLowerCase()) || f.fromCode === from.toUpperCase())) return false
      if (to && !(f.to.toLowerCase().includes(toName.toLowerCase()) || f.toCode === to.toUpperCase())) return false
      if (f.price > maxPrice) return false
      if (airlineFilter.length && !airlineFilter.includes(f.airline)) return false
      if (stopsFilter !== null && f.stops > stopsFilter) return false
      if (f.duration > maxDuration) return false
      return true
    })
    switch (sort) {
      case 'price-asc': list = [...list].sort((a, b) => a.price - b.price); break
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break
      case 'duration': list = [...list].sort((a, b) => a.duration - b.duration); break
      case 'departure': list = [...list].sort((a, b) => a.departTime.localeCompare(b.departTime)); break
      default: list = [...list].sort((a, b) => b.seatsLeft - a.seatsLeft)
    }
    return list
  }, [from, to, fromName, toName, maxPrice, airlineFilter, stopsFilter, maxDuration, sort])

  const totalPages = Math.ceil(results.length / PAGE_SIZE)
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const doSearch = () => {
    if (!from && !to) {
      setSearched(true)
      return
    }
    setSearched(true)
  }

  const toggleAirline = (code) => {
    setAirlineFilter((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]))
  }

  const priceCeiling = (flights.length ? Math.max(...flights.map((f) => f.price)) : 2000) + 200

  if (catalogLoading) {
    return <div className="container-x pt-40"><PageLoader /></div>
  }

  return (
    <div className="pt-28">
      {/* Search form */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-ocean-500 pb-14">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="container-x relative">
          <div className="mb-6"><Breadcrumb items={[{ label: 'Flights' }]} /></div>
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">Search Flights</h1>
          <p className="mt-2 text-sm text-white/85">Compare fares from 10+ leading airlines in seconds.</p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong mt-6 rounded-3xl p-4 sm:p-6"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex rounded-full bg-slate-100 dark:bg-slate-800/70 p-1">
                {['round', 'one'].map((t) => (
                  <button key={t} onClick={() => setTrip(t)} className={cx('rounded-full px-4 py-1.5 text-xs font-bold transition-all', trip === t ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-soft' : 'text-slate-500')}>
                    {t === 'round' ? 'Round Trip' : 'One Way'}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                Passengers
                <select value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} className="input-base !w-auto !py-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                Class
                <select value={cls} onChange={(e) => setCls(e.target.value)} className="input-base !w-auto !py-1.5">
                  {['Economy', 'Premium', 'Business', 'First'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
              <div>
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">From</label>
                <input list="airport-list" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="New York (JFK)" className="input-base" />
              </div>
              <div className="relative">
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">To</label>
                <input list="airport-list" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Paris (CDG)" className="input-base" />
                <button
                  onClick={() => { setFrom(to); setTo(from) }}
                  className="absolute right-2.5 top-9 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-brand-600 to-ocean-500 text-white shadow-glow transition-transform hover:rotate-180"
                  aria-label="Swap"
                >
                  <FaArrowRightArrowLeft className="text-xs" />
                </button>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Departure</label>
                <input type="date" min={nextDays(0)} value={depart} onChange={(e) => setDepart(e.target.value)} className="input-base" />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Return</label>
                <input type="date" min={depart} value={ret} disabled={trip === 'one'} onChange={(e) => setRet(e.target.value)} className="input-base disabled:opacity-40" />
              </div>
              <div className="flex items-end">
                <button onClick={doSearch} className="btn-primary w-full"><FaPlaneDeparture /> Search Flights</button>
              </div>
            </div>
            <datalist id="airport-list">
              {airports.map((a) => <option key={a.code} value={`${a.city} (${a.code})`} />)}
            </datalist>
          </motion.div>
        </div>
      </div>

      <div className="container-x py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters sidebar */}
          <aside className="h-fit space-y-6 lg:sticky lg:top-28">
            <div className="glass rounded-3xl p-5">
              <p className="mb-4 flex items-center gap-2 font-display text-sm font-extrabold text-slate-900 dark:text-white">
                <FaSliders className="text-brand-500" /> Filters
                <button onClick={() => { setMaxPrice(priceCeiling); setAirlineFilter([]); setStopsFilter(null); setMaxDuration(1200) }} className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-accent-500 hover:underline">
                  <FaXmark /> Reset
                </button>
              </p>

              <div className="mb-5">
                <p className="mb-2 text-xs font-bold text-slate-500">Max price</p>
                <input type="range" min={100} max={priceCeiling} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-brand-600" />
                <div className="mt-1 flex justify-between text-[11px] font-semibold text-slate-400">
                  <span>$100</span>
                  <span className="rounded-full bg-brand-500/10 px-2 py-0.5 font-extrabold text-brand-600 dark:text-brand-300">{formatPrice(maxPrice)}</span>
                </div>
              </div>

              <div className="mb-5">
                <p className="mb-2 text-xs font-bold text-slate-500">Airlines</p>
                <div className="space-y-1.5">
                  {airlines.map((a) => (
                    <label key={a.code} className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors hover:bg-brand-500/8">
                      <input type="checkbox" checked={airlineFilter.includes(a.code)} onChange={() => toggleAirline(a.code)} className="h-4 w-4 accent-brand-600" />
                      <span>{a.name}</span>
                      <span className="ml-auto text-[10px] text-slate-400">★ {a.rating}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <p className="mb-2 text-xs font-bold text-slate-500">Stops</p>
                <div className="flex gap-2">
                  {[null, 0, 1].map((s) => (
                    <button
                      key={String(s)}
                      onClick={() => setStopsFilter(s)}
                      className={cx(
                        'flex-1 rounded-xl border px-2 py-2 text-[11px] font-bold transition-all',
                        stopsFilter === s ? 'border-transparent bg-gradient-to-r from-brand-600 to-ocean-500 text-white shadow-glow' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-brand-400'
                      )}
                    >
                      {s === null ? 'Any' : s === 0 ? 'Non-stop' : '1 stop'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-bold text-slate-500">Max duration</p>
                <input type="range" min={120} max={1200} step={30} value={maxDuration} onChange={(e) => setMaxDuration(Number(e.target.value))} className="w-full accent-brand-600" />
                <p className="mt-1 text-[11px] font-semibold text-slate-400">{formatDuration(maxDuration)}</p>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {results.length} flights found
                {fromName && toName ? ` · ${fromName} → ${toName}` : ''}
                {trip === 'round' ? ' · round trip' : ' · one way'}
              </p>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-base !w-auto !py-2 text-xs font-bold">
                <option value="recommended">Sort: Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="duration">Duration: Shortest</option>
                <option value="departure">Departure: Earliest</option>
              </select>
            </div>

            {searched && results.length === 0 ? (
              <EmptyState
                title="No flights match your filters"
                text={`Try widening the price range or removing airline filters for ${fromName || 'your origin'} to ${toName || 'destination'}.`}
              />
            ) : !searched ? (
              <EmptyState
                icon={<FaPlaneDeparture />}
                title="Search for flights to begin"
                text="Enter your origin and destination above to compare live fares across airlines."
              />
            ) : pageItems.length === 0 ? (
              <PageLoader />
            ) : (
              <div className="space-y-4">
                {pageItems.map((f, i) => (
                  <FlightCard key={f.id} flight={f} index={i} />
                ))}
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
