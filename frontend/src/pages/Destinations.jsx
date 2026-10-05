import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCompass, FaMagnifyingGlass } from 'react-icons/fa6'
import DestinationCard from '@/components/cards/DestinationCard'
import Breadcrumb from '@/components/common/Breadcrumb'
import Pagination from '@/components/common/Pagination'
import EmptyState from '@/components/common/EmptyState'
import { PageLoader } from '@/components/common/Skeletons'
import { useCatalog } from '@/context/CatalogContext'
import { useSEO } from '@/utils/seo'
import { cx } from '@/utils/helpers'

const PAGE_SIZE = 9
const tags = ['All', 'city', 'beach', 'luxury', 'culture', 'romantic', 'nature', 'adventure', 'food', 'history']

export default function Destinations() {
  useSEO('Destinations — Wanderlust', 'Explore 120+ destinations across 40 countries with guides, weather and insider tips.')
  const { destinations, loading: catalogLoading } = useCatalog()
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState('All')
  const [page, setPage] = useState(1)

  useEffect(() => setPage(1), [query, tag])

  const results = useMemo(() => {
    let list = destinations.filter((d) => {
      if (query && !(d.name.toLowerCase().includes(query.toLowerCase()) || d.country.toLowerCase().includes(query.toLowerCase()) || d.region.toLowerCase().includes(query.toLowerCase()))) return false
      if (tag !== 'All' && !d.tags.includes(tag)) return false
      return true
    })
    return list
  }, [query, tag])

  const totalPages = Math.ceil(results.length / PAGE_SIZE)
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (catalogLoading) {
    return <div className="container-x pt-40"><PageLoader /></div>
  }

  return (
    <div className="pt-28">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-ocean-500 pb-16">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="container-x relative">
          <div className="mb-6"><Breadcrumb items={[{ label: 'Destinations' }]} /></div>
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-5xl">Explore Destinations</h1>
          <p className="mt-3 max-w-xl text-sm text-white/85 sm:text-base">
            From sun-kissed beaches to neon megacities — find your next adventure with guides, weather and local tips.
          </p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-strong mt-8 flex max-w-xl items-center gap-3 rounded-full p-2 pl-5">
            <FaMagnifyingGlass className="text-brand-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by city, country or region…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
            <button className="btn-primary !px-6 !py-2 text-xs">Search</button>
          </motion.div>

          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={cx(
                  'chip backdrop-blur-md border transition-all',
                  tag === t ? 'bg-white text-brand-600 border-white shadow-soft' : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
                )}
              >
                {t === 'All' ? 'All Destinations' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x py-12">
        {results.length === 0 ? (
          <EmptyState icon={<FaCompass />} title="No destinations found" text="Try a different search or clear the filters." />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((d, i) => <DestinationCard key={d.id} destination={d} index={i} />)}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
