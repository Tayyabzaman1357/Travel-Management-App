import { useMemo, useState, useEffect } from 'react'
import { FaShip } from 'react-icons/fa6'
import CruiseCard from '@/components/cards/CruiseCard'
import Breadcrumb from '@/components/common/Breadcrumb'
import Pagination from '@/components/common/Pagination'
import EmptyState from '@/components/common/EmptyState'
import { cruises } from '@/data/cruises'
import { useApp } from '@/context/AppContext'
import { useSEO } from '@/utils/seo'
import { cx } from '@/utils/helpers'

const PAGE_SIZE = 6
const types = ['All', 'Luxury Cruise', 'Family Cruise', 'Destination Cruise']

export default function Cruises() {
  const { formatPrice } = useApp()
  useSEO('Cruises — Wanderlust', 'Book luxury, family and destination cruises across the world\'s most beautiful seas.')

  const [type, setType] = useState('All')
  const [sort, setSort] = useState('recommended')
  const [page, setPage] = useState(1)

  useEffect(() => setPage(1), [type, sort])

  const results = useMemo(() => {
    let list = cruises.filter((c) => type === 'All' || c.type === type)
    switch (sort) {
      case 'price-asc': list = [...list].sort((a, b) => a.price - b.price); break
      case 'nights': list = [...list].sort((a, b) => b.nights - a.nights); break
      case 'rating': list = [...list].sort((a, b) => b.rating - a.rating); break
      default: list = [...list].sort((a, b) => b.reviews - a.reviews)
    }
    return list
  }, [type, sort])

  const totalPages = Math.ceil(results.length / PAGE_SIZE)
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="pt-28">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-ocean-500 pb-14">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="container-x relative">
          <div className="mb-6"><Breadcrumb items={[{ label: 'Cruises' }]} /></div>
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">Set Sail on the Cruise of a Lifetime</h1>
          <p className="mt-2 max-w-xl text-sm text-white/85">From Mediterranean gems to Caribbean sunsets — all-inclusive sailings with world-class ships.</p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <button key={t} onClick={() => setType(t)} className={cx('chip backdrop-blur-md border transition-all', type === t ? 'bg-white text-brand-600 border-white shadow-soft' : 'bg-white/15 text-white border-white/20 hover:bg-white/25')}>
                  {t}
                </button>
              ))}
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-base !w-auto !py-2 text-xs font-bold">
              <option value="recommended">Sort: Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="nights">Nights: Most</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container-x py-12">
        {results.length === 0 ? (
          <EmptyState icon={<FaShip />} title="No cruises in this category" text="Try another sailing category." />
        ) : (
          <>
            <div className="mb-5 text-sm font-semibold text-slate-500">
              {results.length} sailings · starting from {formatPrice(results.length ? Math.min(...results.map((c) => c.price)) : 0)} per person
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {pageItems.map((c, i) => <CruiseCard key={c.id} cruise={c} index={i} />)}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
