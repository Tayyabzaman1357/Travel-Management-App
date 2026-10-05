import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import { FaStar, FaUsers, FaShieldHalved } from 'react-icons/fa6'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import { imgUrl, IMG } from '@/data/images'
import SearchBox from './SearchBox'

const slides = [
  { image: IMG.eiffel, city: 'Paris', tag: 'City of Light' },
  { image: IMG.santoriniSunset, city: 'Santorini', tag: 'Aegean Dream' },
  { image: IMG.maldives, city: 'Maldives', tag: 'Overwater Paradise' },
  { image: IMG.tokyo, city: 'Tokyo', tag: 'Neon & Tradition' },
]

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pt-24">
      {/* Background slider */}
      <div className="absolute inset-0 -z-10">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          pagination={{ clickable: true }}
          className="h-full w-full"
        >
          {slides.map((s) => (
            <SwiperSlide key={s.city}>
              <img src={imgUrl(s.image, 1920)} alt={s.city} className="h-full w-full object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/50 to-transparent" />
      </div>

      {/* Floating decorative chips */}
      <motion.div
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="glass absolute left-[6%] top-[24%] hidden items-center gap-3 rounded-2xl px-4 py-3 xl:flex"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/20 text-amber-400"><FaStar /></span>
        <div>
          <p className="text-sm font-extrabold text-white">4.9/5 Rating</p>
          <p className="text-xs text-white/70">48k+ verified reviews</p>
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, 14, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="glass absolute right-[7%] top-[34%] hidden items-center gap-3 rounded-2xl px-4 py-3 xl:flex"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-400"><FaUsers /></span>
        <div>
          <p className="text-sm font-extrabold text-white">250k+ Travelers</p>
          <p className="text-xs text-white/70">Booked with us this year</p>
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="glass absolute left-[12%] bottom-[30%] hidden items-center gap-3 rounded-2xl px-4 py-3 xl:flex"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-400/20 text-brand-300"><FaShieldHalved /></span>
        <div>
          <p className="text-sm font-extrabold text-white">Secure Payments</p>
          <p className="text-xs text-white/70">256-bit SSL encrypted</p>
        </div>
      </motion.div>

      <div className="container-x relative z-10 pb-16 pt-10 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="chip mx-auto mb-5 bg-white/15 text-white backdrop-blur-md border border-white/20"
        >
          Flights · Hotels · Tours · Cars · Cruises
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto max-w-4xl font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Explore the World,
          <br />
          <span className="bg-gradient-to-r from-ocean-400 via-brand-300 to-fuchsia-300 bg-clip-text text-transparent">Book in Seconds</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-5 max-w-2xl text-base text-white/85 sm:text-lg"
        >
          Discover 120+ destinations across 40 countries. Best price guarantee, free cancellation and 24/7 support on every booking.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mx-auto mt-10 max-w-5xl"
        >
          <SearchBox />
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-white"
        >
          {[
            ['120+', 'Destinations'],
            ['400k+', 'Bookings'],
            ['4.9★', 'Avg. rating'],
            ['24/7', 'Support'],
          ].map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="font-display text-2xl font-extrabold sm:text-3xl">{v}</p>
              <p className="text-xs text-white/70 sm:text-sm">{l}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
