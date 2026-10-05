import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import {
  FaUmbrellaBeach, FaMountainSun, FaCity, FaCrown, FaPeopleGroup, FaLandmark, FaLeaf, FaShip,
  FaPlaneDeparture, FaBed, FaCompass, FaCar, FaTrashCan, FaStar, FaAward,
} from 'react-icons/fa6'
import 'swiper/css'
import 'swiper/css/pagination'
import Img from '@/components/common/Img'
import SectionHeading from '@/components/common/SectionHeading'
import DestinationCard from '@/components/cards/DestinationCard'
import HotelCard from '@/components/cards/HotelCard'
import TourCard from '@/components/cards/TourCard'
import TestimonialCard from '@/components/cards/TestimonialCard'
import OfferCard from '@/components/cards/OfferCard'
import StatCounter from '@/components/common/StatCounter'
import Accordion from '@/components/common/Accordion'
import { testimonials, stats } from '@/data/testimonials'
import { offers } from '@/data/offers'
import { allFaqs } from '@/data/faqs'
import { useApp } from '@/context/AppContext'
import { useCatalog } from '@/context/CatalogContext'
import { formatTime, formatDuration } from '@/utils/format'
import { getAirline } from '@/data/flights'
import { TRAVEL_CATEGORIES } from '@/utils/constants'
import { getRecentlyViewed, clearRecentlyViewed } from '@/services/recentlyViewed'

const catIcons = {
  beach: <FaUmbrellaBeach />, adventure: <FaMountainSun />, city: <FaCity />, luxury: <FaCrown />,
  family: <FaPeopleGroup />, culture: <FaLandmark />, nature: <FaLeaf />, cruise: <FaShip />,
}

/* ── Destinations ─────────────────────────────────────────────────────────── */

export function HomeDestinations() {
  const { destinations } = useCatalog()
  const featured = destinations.filter((d) => d.featured).length ? destinations.filter((d) => d.featured) : destinations.slice(0, 8)
  return (
    <section className="section-pad">
      <div className="container-x">
        <SectionHeading
          eyebrow="Popular Destinations"
          title="Places travelers are booking now"
          subtitle="Hand-picked destinations with the best flight and hotel deals this season."
          action="Explore all destinations"
          to="/destinations"
        />        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.slice(0, 8).map((d, i) => (
            <DestinationCard key={d.id} destination={d} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Trending Hotels ──────────────────────────────────────────────────────── */

export function HomeHotels() {
  const { hotels } = useCatalog()
  const featured = hotels.filter((h) => h.featured).length ? hotels.filter((h) => h.featured) : hotels.slice(0, 8)
  return (
    <section className="section-pad bg-gradient-to-b from-transparent via-brand-500/5 to-transparent">
      <div className="container-x">
        <SectionHeading
          eyebrow="Trending Hotels"
          title="Stay somewhere spectacular"
          subtitle="Our most-booked stays this week — from jungle villas to overwater suites."
          action="Browse all hotels"
          to="/hotels"
        />
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 }, 1400: { slidesPerView: 4 } }}
          autoplay={{ delay: 4200, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="!pb-12 [&_.swiper-pagination-bullet]:!bg-brand-500"
        >
          {featured.map((h, i) => (
            <SwiperSlide key={h.id}><HotelCard hotel={h} index={i} /></SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

/* ── Popular Flights ──────────────────────────────────────────────────────── */

export function HomeFlights() {
  const { formatPrice } = useApp()
  const { flights } = useCatalog()
  return (
    <section className="section-pad">
      <div className="container-x">
        <SectionHeading
          eyebrow="Popular Flights"
          title="Top routes at great fares"
          subtitle="Direct and one-stop options to the world's most loved cities."
          action="Search flights"
          to="/flights"
        />
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{ 640: { slidesPerView: 2 }, 1280: { slidesPerView: 3 } }}
          autoplay={{ delay: 5200, disableOnInteraction: false }}
          className="!pb-2"
        >
          {flights.slice(0, 9).map((f) => {
            const al = getAirline(f.airline)
            return (
              <SwiperSlide key={f.id}>
                <Link
                  to={`/booking?type=flight&id=${f.id}`}
                  className="glass group block rounded-3xl p-5 card-hover"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/10 text-lg text-brand-600 dark:text-brand-300">
                      <FaPlaneDeparture />
                    </span>
                    <span className="chip bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{f.stops === 0 ? 'Non-stop' : `${f.stops} stop`}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">{formatTime(f.departTime)}</p>
                      <p className="text-xs font-bold text-slate-500">{f.fromCode} · {f.from}</p>
                    </div>
                    <div className="flex flex-col items-center px-2">
                      <span className="h-px w-14 bg-gradient-to-r from-brand-500 to-ocean-500 sm:w-20" />
                      <p className="mt-1 text-[11px] font-semibold text-slate-400">{formatDuration(f.duration)} · {al?.name || ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">{formatTime(f.arriveTime)}</p>
                      <p className="text-xs font-bold text-slate-500">{f.toCode} · {f.to}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                    <p className="font-display text-xl font-extrabold text-slate-900 dark:text-white">{formatPrice(f.price)}</p>
                    <span className="rounded-full bg-gradient-to-r from-brand-600 to-ocean-500 px-4 py-2 text-xs font-bold text-white transition-transform group-hover:scale-105">
                      Book
                    </span>
                  </div>
                </Link>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </section>
  )
}

/* ── Exclusive Offers ─────────────────────────────────────────────────────── */

export function HomeOffers() {
  return (
    <section className="section-pad bg-gradient-to-b from-transparent via-accent-500/5 to-transparent">
      <div className="container-x">
        <SectionHeading
          eyebrow="Exclusive Offers"
          title="Deals you don't want to miss"
          subtitle="Coupons, promos and seasonal discounts — updated daily."
          action="See all offers"
          to="/offers"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.slice(0, 3).map((o, i) => (
            <OfferCard key={o.id} offer={o} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Travel Categories ────────────────────────────────────────────────────── */

export function HomeCategories() {
  return (
    <section className="section-pad">
      <div className="container-x">
        <SectionHeading
          eyebrow="Travel Categories"
          title="What kind of traveler are you?"
          subtitle="From adrenaline treks to five-star escapes — find your perfect journey."
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {TRAVEL_CATEGORIES.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={c.id === 'cruise' ? '/cruises' : `/tours?type=${c.id}`}
                className="glass group flex flex-col items-center gap-3 rounded-3xl px-3 py-6 card-hover"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/15 to-ocean-500/15 text-2xl text-brand-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-gradient-to-br group-hover:from-brand-600 group-hover:to-ocean-500 group-hover:text-white">
                  {catIcons[c.id]}
                </span>
                <span className="text-center text-xs font-bold text-slate-700 dark:text-slate-200">{c.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Tours preview ────────────────────────────────────────────────────────── */

export function HomeTours() {
  const { tours } = useCatalog()
  return (
    <section className="section-pad bg-gradient-to-b from-transparent via-brand-500/5 to-transparent">
      <div className="container-x">
        <SectionHeading
          eyebrow="Guided Tours"
          title="Experiences worth the story"
          subtitle="Small groups, expert guides and itineraries perfected over thousands of trips."
          action="Browse all tours"
          to="/tours"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tours.slice(0, 4).map((t, i) => (
            <TourCard key={t.id} tour={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Customer Reviews ─────────────────────────────────────────────────────── */

export function HomeReviews() {
  return (
    <section className="section-pad">
      <div className="container-x">
        <SectionHeading
          eyebrow="Customer Reviews"
          title="Loved by travelers worldwide"
          subtitle="Real reviews from verified customers across 120+ destinations."
          action="Read all reviews"
          to="/testimonials"
        />
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{ 640: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }}
          autoplay={{ delay: 4600, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="!pb-12 [&_.swiper-pagination-bullet]:!bg-brand-500"
        >
          {testimonials.slice(0, 6).map((tm, i) => (
            <SwiperSlide key={tm.id}><TestimonialCard testimonial={tm} index={i} /></SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

/* ── Statistics ───────────────────────────────────────────────────────────── */

const statIcons = {
  'Happy Travelers': <FaPeopleGroup />,
  Destinations: <FaCompass />,
  '5-Star Reviews': <FaStar />,
  'Years of Excellence': <FaAward />,
}

export function HomeStats() {
  return (
    <section className="section-pad relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-600 via-brand-500 to-ocean-500" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-20" />
      <div className="container-x">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} icon={statIcons[s.label]} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Recently Viewed ─────────────────────────────────────────────────────── */

export function HomeRecentlyViewed() {
  const { formatPrice } = useApp()
  const [items, setItems] = useState(() => getRecentlyViewed())
  if (items.length === 0) return null

  const linkFor = (type, id) =>
    type === 'destination' ? `/destinations/${id}` : `/booking?type=${type}&id=${id}`

  const priceFor = (type, item) =>
    type === 'car' ? formatPrice(item.pricePerDay) : item.price != null ? formatPrice(item.price) : null

  return (
    <section className="section-pad">
      <div className="container-x">
        <div className="mb-6 flex items-end justify-between gap-4">
          <SectionHeading eyebrow="Recently Viewed" title="Pick up where you left off" className="!mb-0" />
          <button
            onClick={() => { clearRecentlyViewed(); setItems([]) }}
            className="shrink-0 rounded-full border border-accent-500/40 px-4 py-2 text-xs font-bold text-accent-500 transition-all hover:bg-accent-500 hover:text-white"
          >
            <FaTrashCan className="mr-1 inline" /> Clear history
          </button>
        </div>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }, 1400: { slidesPerView: 5 } }}
          autoplay={{ delay: 4800, disableOnInteraction: false }}
          className="!pb-2"
        >
          {items.map((r) => (
            <SwiperSlide key={`${r.type}-${r.id}`}>
              <Link to={linkFor(r.type, r.id)} className="glass group block overflow-hidden rounded-3xl card-hover">
                <div className="relative h-36 overflow-hidden">
                  <Img src={r.item.image} seed={`rv-${r.type}-${r.id}`} alt={r.item.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <span className="badge-float left-3 top-3 capitalize">{r.type}</span>
                </div>
                <div className="p-4">
                  <p className="line-clamp-1 font-display text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300">
                    {r.type === 'flight' ? `${r.item.from} → ${r.item.to}` : r.item.name}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">{r.type === 'hotel' ? `${r.item.city}, ${r.item.country}` : r.type === 'flight' ? r.item.flightNo : r.item.destination || r.item.country || ''}</span>
                    {priceFor(r.type, r.item) && (
                      <span className="font-display text-sm font-extrabold text-brand-600 dark:text-brand-300">{priceFor(r.type, r.item)}</span>
                    )}
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

/* ── FAQ ──────────────────────────────────────────────────────────────────── */

export function HomeFAQ() {
  const items = allFaqs.slice(0, 6)
  return (
    <section className="section-pad">
      <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions? We've got answers"
            subtitle="Everything you need to know about booking, payments, cancellations and more."
          />
          <div className="glass flex flex-col gap-4 rounded-3xl p-6">
            <div>
              <p className="font-display text-sm font-extrabold text-slate-900 dark:text-white">Still need help?</p>
              <p className="text-xs text-slate-500">Our team replies within 15 minutes</p>
            </div>
            <Link to="/faq" className="btn-primary text-xs">Visit full FAQ</Link>
          </div>
        </div>
        <div className="lg:col-span-3">
          <Accordion items={items} />
        </div>
      </div>
    </section>
  )
}

/* ── Booking strip ────────────────────────────────────────────────────────── */

export function HomeCtaStrip() {
  const links = [
    { to: '/flights', icon: <FaPlaneDeparture />, label: 'Flights' },
    { to: '/hotels', icon: <FaBed />, label: 'Hotels' },
    { to: '/tours', icon: <FaCompass />, label: 'Tours' },
    { to: '/cars', icon: <FaCar />, label: 'Cars' },
    { to: '/cruises', icon: <FaShip />, label: 'Cruises' },
  ]
  return (
    <div className="container-x">
      <div className="glass flex flex-col items-center justify-between gap-4 rounded-3xl px-8 py-6 sm:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="group flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 transition-all hover:border-transparent hover:bg-gradient-to-r hover:from-brand-600 hover:to-ocean-500 hover:text-white"
            >
              <span className="text-brand-500 transition-colors group-hover:text-white">{l.icon}</span> {l.label}
            </Link>
          ))}
        </div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">⚡ Instant confirmation on all bookings</p>
      </div>
    </div>
  )
}
