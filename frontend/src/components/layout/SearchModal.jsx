import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaMagnifyingGlass, FaLocationDot, FaPlane, FaBed, FaCompass, FaXmark } from 'react-icons/fa6'
import Modal from '@/components/common/Modal'
import Img from '@/components/common/Img'
import { getAirline } from '@/data/flights'
import { blogPosts } from '@/data/blogPosts'
import { useCatalog } from '@/context/CatalogContext'
import { useDebounce } from '@/hooks/useDebounce'
import { useApp } from '@/context/AppContext'
import { cx } from '@/utils/helpers'

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('')
  const debounced = useDebounce(query, 200)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { formatPrice } = useApp()
  const { destinations, hotels, flights, tours } = useCatalog()

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 250)
    }
  }, [open])

  const q = debounced.trim().toLowerCase()

  const results = q
    ? {
        destinations: destinations.filter((d) => d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)).slice(0, 4),
        hotels: hotels.filter((h) => h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q)).slice(0, 4),
        flights: flights.filter((f) => f.from.toLowerCase().includes(q) || f.to.toLowerCase().includes(q) || f.flightNo.toLowerCase().includes(q)).slice(0, 4),
        tours: tours.filter((t) => t.name.toLowerCase().includes(q) || t.destination.toLowerCase().includes(q)).slice(0, 4),
        blog: blogPosts.filter((b) => b.title.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)).slice(0, 3),
      }
    : { destinations: destinations.slice(0, 4), hotels: hotels.slice(0, 4), flights: [], tours: [], blog: [] }

  const total = Object.values(results).flat().length
  const noResults = q.length > 0 && total === 0

  const go = (path) => {
    onClose()
    navigate(path)
  }

  return (
    <Modal open={open} onClose={onClose} title="Search Wanderlust" size="lg">
      <div className="relative">
        <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-brand-500" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search destinations, hotels, flights, tours, articles…"
          className="input-base !py-4 !pl-12 !text-base"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-accent-500" aria-label="Clear">
            <FaXmark />
          </button>
        )}
      </div>

      <div className="mt-6 max-h-[55vh] space-y-6 overflow-y-auto pr-2">
        {noResults && (
          <div className="py-10 text-center">
            <p className="font-display text-lg font-bold text-slate-900 dark:text-white">No results for “{query}”</p>
            <p className="mt-1 text-sm text-slate-500">Try “Paris”, “flight”, “beach” or “luxury”.</p>
          </div>
        )}

        <SearchGroup title="Destinations" count={results.destinations.length} icon={<FaCompass className="text-brand-500" />}>
          {results.destinations.map((d) => (
            <ResultRow key={d.id} onClick={() => go(`/destinations/${d.id}`)} image={d.image} seed={`sd-${d.id}`} title={d.name} subtitle={`${d.country} · from ${formatPrice(d.price)}`} icon={<FaLocationDot />} />
          ))}
        </SearchGroup>

        <SearchGroup title="Hotels" count={results.hotels.length} icon={<FaBed className="text-brand-500" />}>
          {results.hotels.map((h) => (
            <ResultRow key={h.id} onClick={() => go(`/booking?type=hotel&id=${h.id}`)} image={h.image} seed={`sh-${h.id}`} title={h.name} subtitle={`${h.city}, ${h.country} · ${formatPrice(h.price)}/night`} />
          ))}
        </SearchGroup>

        <SearchGroup title="Flights" count={results.flights.length} icon={<FaPlane className="text-brand-500" />}>
          {results.flights.map((f) => (
            <ResultRow key={f.id} onClick={() => go(`/booking?type=flight&id=${f.id}`)} image={f.image || ''} seed={`sf-${f.id}`} title={`${f.from} → ${f.to}`} subtitle={`${getAirline(f.airline)?.name || f.airline} · ${f.flightNo} · ${formatPrice(f.price)}`} icon={<FaPlane />} />
          ))}
        </SearchGroup>

        <SearchGroup title="Tours" count={results.tours.length} icon={<FaCompass className="text-brand-500" />}>
          {results.tours.map((tr) => (
            <ResultRow key={tr.id} onClick={() => go(`/booking?type=tour&id=${tr.id}`)} image={tr.image} seed={`st-${tr.id}`} title={tr.name} subtitle={`${tr.destination} · ${tr.duration} · ${formatPrice(tr.price)}`} />
          ))}
        </SearchGroup>

        <SearchGroup title="Articles" count={results.blog.length} icon="📝">
          {results.blog.map((b) => (
            <ResultRow key={b.id} onClick={() => go(`/blog/${b.id}`)} image={b.image} seed={`sb-${b.id}`} title={b.title} subtitle={`${b.category} · ${b.readTime} min read`} />
          ))}
        </SearchGroup>
      </div>
    </Modal>
  )
}

function SearchGroup({ title, count, icon, children }) {
  if (count === 0) return null
  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
        {icon} {title} <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] text-brand-600">{count}</span>
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function ResultRow({ onClick, image, seed, title, subtitle, icon }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-all duration-200 hover:bg-brand-500/8"
    >
      {image ? (
        <Img src={image} seed={seed} alt="" className="h-12 w-14 shrink-0 rounded-xl object-cover" />
      ) : (
        <span className="flex h-12 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500">{icon}</span>
      )}
      <span className="min-w-0 flex-1">
        <span className={cx('block truncate text-sm font-bold text-slate-800 dark:text-slate-100')}>{title}</span>
        <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{subtitle}</span>
      </span>
    </button>
  )
}
