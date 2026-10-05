import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaBullseye, FaEye, FaHandshake, FaLeaf, FaLightbulb, FaHeart } from 'react-icons/fa6'
import Breadcrumb from '@/components/common/Breadcrumb'
import Img from '@/components/common/Img'
import { IMG } from '@/data/images'
import { useSEO } from '@/utils/seo'

const values = [    { icon: <FaHeart />, title: 'Customer First', text: 'Every decision starts with one question: what is best for the traveler?' },
  { icon: <FaLightbulb />, title: 'Innovation', text: 'We build tools that make planning effortless — from live price alerts to instant booking.' },
  { icon: <FaHandshake />, title: 'Integrity', text: 'Honest pricing, transparent policies and no hidden fees. Ever.' },
  { icon: <FaLeaf />, title: 'Sustainability', text: 'We champion responsible travel and offset carbon on every booking.' },
]

const team = [
  { name: 'Alex Morgan', role: 'CEO & Co-Founder', avatar: 'https://i.pravatar.cc/150?img=13', bio: 'Former airline exec with 15 years in travel tech.' },
  { name: 'Sofia Reyes', role: 'CTO & Co-Founder', avatar: 'https://i.pravatar.cc/150?img=32', bio: 'Full-stack architect and cloud-native enthusiast.' },
  { name: 'Kenji Tanaka', role: 'Head of Product', avatar: 'https://i.pravatar.cc/150?img=12', bio: 'Design-led product thinker with a passport habit.' },
  { name: 'Emma Johnson', role: 'Head of Partnerships', avatar: 'https://i.pravatar.cc/150?img=44', bio: 'Has shaken hands with 300+ hotel owners worldwide.' },
]

const timeline = [
  { year: '2011', title: 'The dream takes off', text: 'Founded in a small London flat with a single search engine for flights.' },
  { year: '2014', title: 'Hotels join the journey', text: 'Launched our hotel platform, adding 100k+ properties in year one.' },
  { year: '2017', title: '1M travelers', text: 'Celebrated one million bookings with our very first loyalty program.' },
  { year: '2020', title: 'All-in-one travel', text: 'Expanded to tours, cars, cruises, visas and insurance.' },
  { year: '2024', title: 'AI-powered planning', text: 'Introduced smart itineraries and live price prediction.' },
  { year: '2026', title: '250k+ happy travelers', text: 'Today we serve travelers in 40+ countries with 24/7 human support.' },
]

const achievements = [
  { value: '15', label: 'Years of Excellence' },
  { value: '120+', label: 'Destinations' },
  { value: '400k+', label: 'Happy Bookings' },
  { value: '4.9/5', label: 'Average Rating' },
]

export default function About() {
  useSEO('About Us — Wanderlust', "The story, mission and people behind the world's friendliest travel platform.")

  return (
    <div className="pt-28">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-ocean-500 pb-16">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="container-x relative">
          <div className="mb-6"><Breadcrumb items={[{ label: 'About Us' }]} /></div>
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-5xl">Travel is personal. <br />We treat it that way.</h1>
          <p className="mt-4 max-w-2xl text-sm text-white/85 sm:text-base">
            Wanderlust began with a simple frustration: booking travel was complicated, opaque and stressful. Fifteen years later, we're proud to power more than 400,000 joyful journeys a year.
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="container-x grid grid-cols-1 items-center gap-10 py-16 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <span className="chip bg-brand-500/10 text-brand-600 dark:text-brand-300">Our Story</span>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-slate-900 dark:text-white">From a flat in London to the world</h2>
          <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
            What started as two friends building a better flight search has grown into a complete travel ecosystem. We negotiate the best rates, build beautiful tools, and back every trip with 24/7 human support — so you can spend less time planning and more time exploring.
          </p>
          <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
            Today our platform covers flights, hotels, tours, car rentals, cruises, visas and insurance across 40+ countries — with a best-price guarantee and free cancellation on most bookings.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {achievements.map((a) => (
              <div key={a.label} className="glass rounded-2xl p-4 text-center">
                <p className="font-display text-2xl font-extrabold text-gradient">{a.value}</p>
                <p className="mt-1 text-[11px] font-semibold text-slate-500">{a.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
          <Img src={IMG.team} seed="about-team" alt="Wanderlust team" className="h-80 w-full rounded-3xl object-cover shadow-soft-lg sm:h-96" />
          <div className="glass-strong absolute -bottom-6 -left-4 rounded-2xl p-4 sm:-left-8">
            <p className="font-display text-2xl font-extrabold text-gradient">40+</p>
            <p className="text-xs font-semibold text-slate-500">Countries served</p>
          </div>
          <div className="glass-strong absolute -right-4 -top-4 rounded-2xl p-4 sm:-right-6">
            <p className="font-display text-2xl font-extrabold text-gradient">24/7</p>
            <p className="text-xs font-semibold text-slate-500">Human support</p>
          </div>
        </motion.div>
      </div>

      {/* Mission & Vision */}
      <section className="container-x pb-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl p-8 card-hover">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-ocean-500 text-2xl text-white shadow-glow"><FaBullseye /></span>
            <h3 className="mt-5 font-display text-2xl font-extrabold text-slate-900 dark:text-white">Our Mission</h3>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
              To make world travel effortless, transparent and accessible for everyone — by combining the best prices with technology that feels like magic.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass rounded-3xl p-8 card-hover">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-500 to-emerald-500 text-2xl text-white shadow-glow"><FaEye /></span>
            <h3 className="mt-5 font-display text-2xl font-extrabold text-slate-900 dark:text-white">Our Vision</h3>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
              A world where anyone, anywhere, can explore any destination with confidence — and where travel enriches the places and people it touches.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="container-x pb-16">
        <div className="mb-10 text-center">
          <span className="chip bg-brand-500/10 text-brand-600 dark:text-brand-300">Our Values</span>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-slate-900 dark:text-white">What we stand for</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <motion.div key={v.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass rounded-3xl p-6 text-center card-hover">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-2xl text-brand-500">{v.icon}</span>
              <h3 className="mt-4 font-display text-lg font-extrabold text-slate-900 dark:text-white">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="container-x pb-16">
        <div className="mb-10 text-center">
          <span className="chip bg-brand-500/10 text-brand-600 dark:text-brand-300">Our Team</span>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-slate-900 dark:text-white">The people behind the platform</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <motion.div key={m.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass group overflow-hidden rounded-3xl p-6 text-center card-hover">
              <Img src={m.avatar} seed={`team-${i}`} alt={m.name} className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-brand-500/15 transition-transform duration-300 group-hover:scale-105" />
              <h3 className="mt-4 font-display text-lg font-extrabold text-slate-900 dark:text-white">{m.name}</h3>
              <p className="text-xs font-bold text-brand-600 dark:text-brand-300">{m.role}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{m.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="container-x pb-16">
        <div className="mb-10 text-center">
          <span className="chip bg-brand-500/10 text-brand-600 dark:text-brand-300">Milestones</span>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-slate-900 dark:text-white">Our journey so far</h2>
        </div>
        <div className="relative mx-auto max-w-3xl">
          <span className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-brand-500 via-brand-400 to-ocean-500 sm:left-1/2 sm:-translate-x-1/2" />
          <div className="space-y-8">
            {timeline.map((t, i) => (
              <motion.div key={t.year} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className={`relative flex items-start gap-6 pl-12 sm:w-1/2 sm:pl-0 ${i % 2 === 0 ? 'sm:pr-10 sm:text-right' : 'sm:ml-auto sm:pl-10'}`}>
                <span className={`absolute left-2 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-brand-600 to-ocean-500 ring-4 ring-white dark:ring-slate-950 ${i % 2 === 0 ? 'sm:left-auto sm:-right-2.5' : 'sm:-left-2.5'}`} />
                <div className="glass w-full rounded-3xl p-5">
                  <span className="chip bg-gradient-to-r from-brand-600 to-ocean-500 text-white">{t.year}</span>
                  <h3 className="mt-3 font-display text-lg font-extrabold text-slate-900 dark:text-white">{t.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{t.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x pb-16">
        <div className="glass relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 to-ocean-500 p-10 text-center">
          <h2 className="font-display text-3xl font-extrabold text-white">Ready to write your own story?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/85">Join 250,000+ travelers who trust Wanderlust for their adventures.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/flights" className="rounded-full bg-white px-8 py-3 text-sm font-extrabold text-brand-600 shadow-soft transition-all hover:scale-105">Book a flight</Link>
            <Link to="/destinations" className="rounded-full border-2 border-white/60 px-8 py-3 text-sm font-extrabold text-white transition-all hover:bg-white/10">Explore destinations</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
