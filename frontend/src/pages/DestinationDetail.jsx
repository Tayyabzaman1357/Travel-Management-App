import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaLocationDot, FaCloudSun, FaUtensils, FaPlane, FaBed } from 'react-icons/fa6'
import Img from '@/components/common/Img'
import Breadcrumb from '@/components/common/Breadcrumb'
import ImageGallery from '@/components/common/ImageGallery'
import Rating from '@/components/common/Rating'
import MapView from '@/components/common/MapView'
import HotelCard from '@/components/cards/HotelCard'
import FlightCard from '@/components/cards/FlightCard'
import EmptyState from '@/components/common/EmptyState'
import { PageLoader } from '@/components/common/Skeletons'
import { useCatalog } from '@/context/CatalogContext'
import { fetchWeather } from '@/services/external'
import { recordRecentlyViewed } from '@/services/recentlyViewed'
import { useApp } from '@/context/AppContext'
import { useSEO } from '@/utils/seo'
import { nextDays } from '@/utils/format'
import { cx } from '@/utils/helpers'

const sampleReviews = [
  { id: 1, name: 'Liam Carter', avatar: 'https://i.pravatar.cc/150?img=53', rating: 5, text: 'Absolutely unforgettable. The itinerary was flawless and every recommendation was spot on.', date: '2026-06-18' },
  { id: 2, name: 'Priya Sharma', avatar: 'https://i.pravatar.cc/150?img=32', rating: 4.5, text: 'Beautiful place and seamless booking. Would love a bit more guidance on local transport next time.', date: '2026-05-30' },
  { id: 3, name: 'Mateo García', avatar: 'https://i.pravatar.cc/150?img=11', rating: 5, text: 'The best trip we have taken as a family. Everything was organised to perfection.', date: '2026-05-12' },
]

export default function DestinationDetail() {
  const { id } = useParams()
  const { hotels, flights, getItem, loading: catalogLoading } = useCatalog()
  const dest = useMemo(() => getItem('destination', id), [id, getItem])
  const { formatPrice } = useApp()
  const [weather, setWeather] = useState(null)
  const [loadingWeather, setLoadingWeather] = useState(true)

  useSEO(
    dest ? `${dest.name} Travel Guide — Wanderlust` : 'Destination — Wanderlust',
    dest?.description?.slice(0, 150)
  )

  useEffect(() => {
    if (!dest) return
    recordRecentlyViewed(dest, 'destination')
    let mounted = true
    setLoadingWeather(true)
    fetchWeather(dest.coords?.lat ?? 0, dest.coords?.lng ?? 0).then((w) => {
      if (mounted) setWeather(w)
      setLoadingWeather(false)
    })
    return () => { mounted = false }
  }, [id, dest])

  if (catalogLoading && !dest) {
    return <div className="container-x pt-40"><PageLoader /></div>
  }

  if (!dest) {
    return (
      <div className="container-x pt-40">
        <EmptyState title="Destination not found" text="The destination you are looking for does not exist." action={<Link to="/destinations" className="btn-primary">Browse destinations</Link>} />
      </div>
    )
  }

  const nearbyHotels = hotels.filter((h) => h.destinationId === dest.id || h.city.toLowerCase() === dest.name.toLowerCase())
  const nearbyFlights = flights.filter((f) => f.to.toLowerCase() === dest.name.toLowerCase() || f.from.toLowerCase() === dest.name.toLowerCase())

  const wIcon = {
    sunny: '☀️', cloudy: '⛅', cloud: '☁️', fog: '🌫️', rainy: '🌧️', snow: '❄️', storm: '⛈️',
  }

  return (
    <div className="pt-24">
      {/* Hero */}
      <div className="relative h-[420px] overflow-hidden sm:h-[500px]">
        <Img src={dest.image} seed={`dh-${dest.id}`} alt={dest.name} className="h-full w-full object-cover" eager />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
        <div className="container-x absolute bottom-0 left-0 right-0 pb-10">
          <Breadcrumb items={[{ label: 'Destinations', to: '/destinations' }, { label: dest.name }]} />
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="chip bg-white/15 text-white backdrop-blur-md"><FaLocationDot /> {dest.country} · {dest.region}</span>
              {(dest.tags || []).map((t) => <span key={t} className="chip bg-brand-500/30 text-white backdrop-blur-md capitalize">{t}</span>)}
            </div>
            <h1 className="mt-3 font-display text-4xl font-extrabold text-white sm:text-6xl">{dest.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <Rating value={dest.rating} count={dest.reviews} size="md" />
              <p className="text-white/90">From <span className="font-display text-2xl font-extrabold text-amber-300">{formatPrice(dest.price)}</span>
                {dest.oldPrice && <span className="ml-2 text-sm text-white/50 line-through">{formatPrice(dest.oldPrice)}</span>}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-x grid grid-cols-1 gap-10 py-12 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-10 lg:col-span-2">
          <section>
            <h2 className="mb-4 font-display text-2xl font-extrabold text-slate-900 dark:text-white">About {dest.name}</h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">{dest.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {(dest.highlights || []).map((h) => (
                <span key={h} className="chip bg-brand-500/10 text-brand-600 dark:text-brand-300">{h}</span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-display text-2xl font-extrabold text-slate-900 dark:text-white">Photo Gallery</h2>
            <ImageGallery images={dest.gallery || []} seed={`gallery-${dest.id}`} />
          </section>

          <section>
            <h2 className="mb-4 font-display text-2xl font-extrabold text-slate-900 dark:text-white">Top Attractions</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {(dest.attractions || []).map((a, i) => (
                <motion.div
                  key={a.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group relative h-56 overflow-hidden rounded-3xl"
                >
                  <Img src={a.image} seed={`attr-${dest.id}-${i}`} alt={a.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 to-transparent" />
                  <div className="absolute bottom-0 p-4">
                    <h3 className="font-display text-lg font-extrabold text-white">{a.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/80">{a.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-extrabold text-slate-900 dark:text-white">
              <FaUtensils className="text-brand-500" /> Local Food
            </h2>
            <div className="flex flex-wrap gap-2">
              {(dest.food || []).map((f) => (
                <span key={f} className="chip bg-gradient-to-r from-amber-500/10 to-accent-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">{f}</span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-display text-2xl font-extrabold text-slate-900 dark:text-white">Traveler Reviews</h2>
            <div className="space-y-4">
              {sampleReviews.map((r) => (
                <div key={r.id} className="glass rounded-3xl p-5">
                  <div className="flex items-center gap-3">
                    <Img src={r.avatar} seed={`rev-${r.id}`} alt={r.name} className="h-11 w-11 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{r.name}</p>
                      <Rating value={r.rating} size="xs" />
                    </div>
                    <span className="text-[11px] text-slate-400">{r.date}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{r.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Weather */}
          <div className="glass rounded-3xl p-5">
            <p className="mb-4 flex items-center gap-2 font-display text-sm font-extrabold text-slate-900 dark:text-white">
              <FaCloudSun className="text-brand-500" /> Current Weather
            </p>
            {loadingWeather ? (
              <div className="skeleton h-24 w-full" />
            ) : weather ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-4xl font-extrabold text-slate-900 dark:text-white">{weather.temp}°C</p>
                    <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{weather.condition}</p>
                    <p className="text-xs text-slate-400">Wind {weather.windSpeed} km/h</p>
                  </div>
                  <span className="text-6xl">{wIcon[weather.icon]}</span>
                </div>
                <div className="mt-4 grid grid-cols-5 gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                  {weather.forecast.map((d) => (
                    <div key={d.day} className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 dark:bg-slate-800/70 py-2">
                      <span className="text-[10px] font-bold text-slate-400">{d.day.slice(0, 3)}</span>
                      <span className="text-sm">{wIcon[d.icon]}</span>
                      <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-200">{d.tempMax}°</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-center text-[10px] text-slate-400">Powered by Open-Meteo</p>
              </>
            ) : (
              <p className="text-sm text-slate-500">Weather unavailable — showing typical conditions: <span className="font-bold">{dest.weather?.condition || 'Sunny'}, {dest.weather?.temp ?? 20}°C</span></p>
            )}
          </div>

          {/* Travel guide */}
          <div className="glass rounded-3xl p-5">
            <p className="mb-4 font-display text-sm font-extrabold text-slate-900 dark:text-white">Travel Guide</p>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li><b>Best time to visit:</b> {dest.bestTime}</li>
              <li><b>Coordinates:</b> {(dest.coords?.lat ?? 0).toFixed(2)}, {(dest.coords?.lng ?? 0).toFixed(2)}</li>
              <li><b>Currency:</b> Local currency accepted; cards widely used in tourist areas.</li>
            </ul>
          </div>

          {/* Map */}
          <MapView
            className="h-72"
            center={[dest.coords?.lat ?? 0, dest.coords?.lng ?? 0]}
            zoom={12}
            markers={[{ position: [dest.coords?.lat ?? 0, dest.coords?.lng ?? 0], title: dest.name, subtitle: dest.country }]}
          />

          {/* Book CTA */}
          <Link to={`/flights?to=${dest.name}`} className={cx('btn-primary w-full !py-4')}>
            <FaPlane /> Book flights to {dest.name}
          </Link>
        </aside>
      </div>

      {/* Nearby hotels */}
      <section className="container-x pb-12">
        <h2 className="mb-6 flex items-center gap-2 font-display text-2xl font-extrabold text-slate-900 dark:text-white">
          <FaBed className="text-brand-500" /> Nearby Hotels
        </h2>
        {nearbyHotels.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {nearbyHotels.map((h, i) => <HotelCard key={h.id} hotel={h} index={i} />)}
          </div>
        ) : (
          <EmptyState icon={<FaBed />} title="No nearby hotels listed yet" text={`Explore stays across other destinations in the meantime.`} action={<Link to="/hotels" className="btn-outline text-xs">Browse all hotels</Link>} />
        )}
      </section>

      {/* Nearby flights */}
      <section className="container-x pb-16">
        <h2 className="mb-6 flex items-center gap-2 font-display text-2xl font-extrabold text-slate-900 dark:text-white">
          <FaPlane className="text-brand-500" /> Flights to {dest.name}
        </h2>
        {nearbyFlights.length ? (
          <div className="space-y-4">
            {nearbyFlights.slice(0, 4).map((f, i) => <FlightCard key={f.id} flight={f} index={i} />)}
          </div>
        ) : (
          <EmptyState icon={<FaPlane />} title="No direct routes listed" text="Search all routes to find the best connection for your dates." action={<Link to="/flights" className="btn-outline text-xs">Search flights</Link>} />
        )}
      </section>
    </div>
  )
}
