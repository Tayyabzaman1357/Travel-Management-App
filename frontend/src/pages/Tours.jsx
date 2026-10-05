import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCompass, FaMagnifyingGlass } from 'react-icons/fa6'
import TourCard from '@/components/cards/TourCard'
import Breadcrumb from '@/components/common/Breadcrumb'
import Pagination from '@/components/common/Pagination'
import EmptyState from '@/components/common/EmptyState'
import { PageLoader } from '@/components/common/Skeletons'
import { tourTypes, tourTypeLabels } from '@/data/tours'
import { useCatalog } from '@/context/CatalogContext'
import { useApp } from '@/context/AppContext'
import { useSEO } from '@/utils/seo'
import { nextDays } from '@/utils/format'
import { cx } from '@/utils/helpers'

const PAGE_SIZE = 9

export default function Tours() {
  const [params] = useSearchParams()
  const { formatPrice } = useApp()
  const { tours, loading: catalogLoading } = useCatalog()
  useSEO('Tours & Experiences — Wanderlust', 'Book adventure, family, luxury, beach, mountain and historical tours worldwide.')

  const [type, setType] = useState(params.get('type') || 'all')
  const [query, setQuery] = useState(params.get('dest') || '')
  const [maxPrice, setMaxPrice] = useState(2500)
  const [sort, setSort] = useState('recommended')
  const [page, setPage] = useState(1)

  useEffect(() => setPage(1), [type, query, maxPrice, sort])

  const results = useMemo(() => {
    let list = tours.filter((t) => {
      if (type !== 'all' && t.type !== type) return false
      if (query && !(t.name.toLowerCase().includes(query.toLowerCase()) || t.destination.toLowerCase().includes(query.toLowerCase()))) return false
      if (t.price > maxPrice) return false
      return true
    })
    switch (sort) {
      case 'price-asc': list = [...list].sort((a, b) => a.price - b.price); break
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break
      case 'rating': list = [...list].sort((a, b) => b.rating - a.rating); break
      default: list = [...list].sort((a, b) => b.reviews - a.reviews)
    }
    return list
  }, [type, query, maxPrice, sort])

  const totalPages = Math.ceil(results.length / PAGE_SIZE)
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (catalogLoading) {
    return <div className="container-x pt-40"><PageLoader /></div>
  }

  return (
    <div className="pt-28">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-ocean-500 pb-14">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="container-x relative">
          <div className="mb-6"><Breadcrumb items={[{ label: 'Tours' }]} /></div>
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">Guided Tours & Experiences</h1>
          <p className="mt-2 max-w-xl text-sm text-white/85">Small groups, expert local guides and itineraries refined over thousands of trips.</p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="glass-strong flex max-w-md flex-1 items-center gap-3 rounded-full p-2 pl-5">
              <FaMagnifyingGlass className="text-brand-500" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tours or destinations…" className="w-full bg-transparent text-sm outline-none" />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-base !w-auto !py-2 text-xs font-bold">
              <option value="recommended">Sort: Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => setType('all')} className={cx('chip backdrop-blur-md border transition-all', type === 'all' ? 'bg-white text-brand-600 border-white shadow-soft' : 'bg-white/15 text-white border-white/20 hover:bg-white/25')}>
              All Tours
            </button>
            {tourTypes.map((t) => (
              <button key={t} onClick={() => setType(t)} className={cx('chip backdrop-blur-md border capitalize transition-all', type === t ? 'bg-white text-brand-600 border-white shadow-soft' : 'bg-white/15 text-white border-white/20 hover:bg-white/25')}>
                {tourTypeLabels[t].replace(' Tours', '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x py-12">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-500">{results.length} tours found</p>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500">
            Max price
            <select value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="input-base !w-auto !py-1.5">
              {[1000, 1500, 2000, 2500, 3000].map((p) => <option key={p} value={p}>Up to {formatPrice(p)}</option>)}
            </select>
          </label>
        </div>

        {results.length === 0 ? (
          <EmptyState icon={<FaCompass />} title="No tours match your criteria" text="Try a different category or search term." />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((t, i) => <TourCard key={t.id} tour={t} index={i} />)}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
