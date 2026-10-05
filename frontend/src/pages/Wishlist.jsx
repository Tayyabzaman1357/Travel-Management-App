import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaHeart, FaTrashCan, FaArrowRight } from 'react-icons/fa6'
import Breadcrumb from '@/components/common/Breadcrumb'
import EmptyState from '@/components/common/EmptyState'
import Img from '@/components/common/Img'
import Rating from '@/components/common/Rating'
import { useWishlist } from '@/context/WishlistContext'
import { useApp } from '@/context/AppContext'
import { useSEO } from '@/utils/seo'
import { formatDate } from '@/utils/format'
import { cx } from '@/utils/helpers'

const typeMeta = {
  hotel: { label: 'Hotels', to: (i) => `/booking?type=hotel&id=${i.id}`, sub: (i) => `${i.city}, ${i.country}`, price: (i) => i.price },
  flight: { label: 'Flights', to: (i) => `/booking?type=flight&id=${i.id}`, sub: (i) => `${i.from} → ${i.to}` },
  destination: { label: 'Destinations', to: (i) => `/destinations/${i.id}`, sub: (i) => `${i.country}` },
  tour: { label: 'Tours', to: (i) => `/booking?type=tour&id=${i.id}`, sub: (i) => `${i.destination} · ${i.duration}` },
  car: { label: 'Cars', to: (i) => `/booking?type=car&id=${i.id}`, sub: (i) => `${i.type}`, price: (i) => i.pricePerDay },
  cruise: { label: 'Cruises', to: (i) => `/booking?type=cruise&id=${i.id}`, sub: (i) => `${i.nights} nights` },
}

export default function Wishlist() {
  useSEO('Wishlist — Wanderlust', 'Your saved hotels, flights, destinations and tours.')
  const { wishlist, removeItem, clearAll, count } = useWishlist()
  const { formatPrice } = useApp()

  const groups = ['hotel', 'flight', 'destination', 'tour', 'car', 'cruise']
    .map((type) => ({ type, items: wishlist.filter((w) => w.type === type) }))
    .filter((g) => g.items.length > 0)

  return (
    <div className="pt-28">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-ocean-500 pb-14">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="container-x relative">
          <div className="mb-6"><Breadcrumb items={[{ label: 'Wishlist' }]} /></div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">Your Wishlist</h1>
              <p className="mt-2 text-sm text-white/85">{count} saved {count === 1 ? 'item' : 'items'} — ready when you are.</p>
            </div>
            {count > 0 && (
              <button onClick={clearAll} className="chip bg-white/15 text-white backdrop-blur-md border border-white/20 hover:bg-accent-500">
                <FaTrashCan /> Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container-x py-12">
        {count === 0 ? (
          <EmptyState
            icon={<FaHeart />}
            title="Your wishlist is empty"
            text="Tap the heart on any hotel, flight, tour or destination to save it here."
            action={<Link to="/destinations" className="btn-primary">Explore destinations</Link>}
          />
        ) : (
          <div className="space-y-10">
            {groups.map((group) => (
              <div key={group.type}>
                <h2 className="mb-4 font-display text-xl font-extrabold text-slate-900 dark:text-white">
                  {typeMeta[group.type].label}
                  <span className="ml-2 text-sm font-semibold text-slate-400">({group.items.length})</span>
                </h2>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence>
                    {group.items.map((w) => {
                      const item = w.item
                      const meta = typeMeta[group.type]
                      const sub = meta.sub(item) + (meta.price ? ` · from ${formatPrice(meta.price(item))}` : '')
                      return (
                        <motion.div
                          key={`${w.type}-${w.id}`}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="glass group overflow-hidden rounded-3xl card-hover"
                        >
                          <Link to={meta.to(item)} className="block">
                            <div className="relative h-40 overflow-hidden">
                              <Img src={item.image} seed={`wl-${w.type}-${w.id}`} alt={item.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              <span className="badge-float right-3 top-3">{item.rating ? `★ ${item.rating}` : ''}</span>
                            </div>
                          </Link>
                          <div className="p-5">
                            <Link to={meta.to(item)}>
                              <h3 className="line-clamp-1 font-display text-base font-extrabold text-slate-900 dark:text-white transition-colors group-hover:text-brand-600">{item.name}</h3>
                            </Link>
                            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{sub}</p>
                            {item.rating && <Rating value={item.rating} count={item.reviews} size="xs" className="mt-2" />}
                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                              <span className="text-[11px] text-slate-400">Saved {formatDate(w.savedAt, { month: 'short', day: 'numeric' })}</span>
                              <div className="flex items-center gap-2">
                                <button onClick={() => removeItem(w.type, w.id)} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 transition-all hover:bg-accent-500 hover:text-white" aria-label="Remove">
                                  <FaTrashCan className="text-xs" />
                                </button>
                                <Link to={meta.to(item)} className={cx('flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-600 to-ocean-500 px-4 text-xs font-bold text-white shadow-glow transition-transform hover:scale-105')}>
                                  Book <FaArrowRight className="text-[10px]" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
