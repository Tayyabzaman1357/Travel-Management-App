import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaPlane, FaBed, FaCompass, FaCar, FaMagnifyingGlass, FaMinus, FaPlus, FaArrowRightArrowLeft, FaLocationDot,
} from 'react-icons/fa6'
import { findAirport, airports } from '@/data/flights'
import { destinations } from '@/data/destinations'
import { tourTypeLabels } from '@/data/tours'
import { carTypes } from '@/data/cars'
import { nextDays, addDays } from '@/utils/format'
import { useClickOutside } from '@/hooks/useClickOutside'
import { cx } from '@/utils/helpers'

const tabs = [
  { key: 'flights', label: 'Flights', icon: <FaPlane /> },
  { key: 'hotels', label: 'Hotels', icon: <FaBed /> },
  { key: 'tours', label: 'Tours', icon: <FaCompass /> },
  { key: 'cars', label: 'Cars', icon: <FaCar /> },
]

export default function SearchBox() {
  const [tab, setTab] = useState('flights')
  const navigate = useNavigate()

  const submit = (params) => {
    const sp = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') sp.set(k, v)
    })
    const qs = sp.toString()
    navigate(`/${tab}${qs ? `?${qs}` : ''}`)
  }

  return (
    <div className="glass-strong rounded-3xl p-3 shadow-soft-lg sm:p-4">
      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={cx(
              'relative flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all duration-300',
              tab === tb.key ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            {tab === tb.key && (
              <motion.span
                layoutId="search-tab-bg"
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-600 to-ocean-500 shadow-glow"
                transition={{ type: 'spring', damping: 24, stiffness: 320 }}
              />
            )}
            <span className="relative">{tb.icon}</span>
            <span className="relative">{tb.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.25 }}
        >
          {tab === 'flights' && <FlightForm onSubmit={submit} />}
          {tab === 'hotels' && <HotelForm onSubmit={submit} />}
          {tab === 'tours' && <TourForm onSubmit={submit} />}
          {tab === 'cars' && <CarForm onSubmit={submit} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ── Field helpers ─────────────────────────────────────────────────────────── */

function Stepper({ value, onChange, min = 1, max = 9 }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-300 transition-all hover:bg-brand-500 hover:text-white active:scale-90"
        aria-label="Decrease"
      >
        <FaMinus className="text-[10px]" />
      </button>
      <span className="w-7 text-center text-sm font-extrabold text-slate-800 dark:text-slate-100">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-300 transition-all hover:bg-brand-500 hover:text-white active:scale-90"
        aria-label="Increase"
      >
        <FaPlus className="text-[10px]" />
      </button>
    </div>
  )
}

function AirportInput({ label, value, onChange, placeholder, exclude = '' }) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const ref = useClickOutside(() => setOpen(false))

  useEffect(() => setQuery(value), [value])

  const matches = query.length >= 1
    ? findAirport(query).filter((a) => a.code !== exclude).slice(0, 6)
    : airports.filter((a) => a.code !== exclude).slice(0, 6)

  const select = (ap) => {
    onChange(ap)
    setQuery(`${ap.city} (${ap.code})`)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <label className="mb-1.5 flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">{label}</label>
      <div className="relative">
        <FaLocationDot className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-brand-500" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            if (e.target.value === '') onChange(null)
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="input-base !pl-10"
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="glass-strong absolute z-20 mt-2 w-full overflow-hidden rounded-2xl p-1.5"
          >
            {matches.map((ap) => (
              <li key={ap.code}>
                <button
                  type="button"
                  onClick={() => select(ap)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-brand-500/10"
                >
                  <span>
                    <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">{ap.city}</span>
                    <span className="block text-xs text-slate-400">{ap.name}, {ap.country}</span>
                  </span>
                  <span className="rounded-lg bg-brand-500/10 px-2 py-1 text-xs font-extrabold text-brand-600 dark:text-brand-300">{ap.code}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Forms ─────────────────────────────────────────────────────────────────── */

function FlightForm({ onSubmit }) {
  const [trip, setTrip] = useState('round')
  const [from, setFrom] = useState(null)
  const [to, setTo] = useState(null)
  const [depart, setDepart] = useState(nextDays(14))
  const [ret, setRet] = useState(nextDays(21))
  const [passengers, setPassengers] = useState(1)
  const [cls, setCls] = useState('Economy')

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-full bg-slate-100 dark:bg-slate-800/70 p-1">
          {['round', 'one'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTrip(t)}
              className={cx(
                'rounded-full px-4 py-1.5 text-xs font-bold transition-all',
                trip === t ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-300 shadow-soft' : 'text-slate-500 dark:text-slate-400'
              )}
            >
              {t === 'round' ? 'Round Trip' : 'One Way'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-slate-400">Passengers</span>
          <Stepper value={passengers} onChange={setPassengers} max={9} />
          <select value={cls} onChange={(e) => setCls(e.target.value)} className="input-base !w-auto !py-2 text-xs font-bold">
            {['Economy', 'Premium', 'Business', 'First'].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AirportInput label="From" value={from ? `${from.city} (${from.code})` : ''} onChange={setFrom} placeholder="New York (JFK)" exclude={to?.code} />
        <div className="relative">
          <AirportInput label="To" value={to ? `${to.city} (${to.code})` : ''} onChange={setTo} placeholder="Paris (CDG)" exclude={from?.code} />
          <button
            type="button"
            onClick={() => {
              const tmp = from
              setFrom(to)
              setTo(tmp)
            }}
            className="absolute -bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-brand-600 to-ocean-500 text-white shadow-glow transition-transform hover:rotate-180 active:scale-90"
            aria-label="Swap"
          >
            <FaArrowRightArrowLeft className="text-xs" />
          </button>
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Departure</label>
          <input type="date" min={nextDays(0)} value={depart} onChange={(e) => { setDepart(e.target.value); if (trip === 'round' && e.target.value > ret) setRet(addDays(e.target.value, 7)) }} className="input-base" />
        </div>
        {trip === 'round' ? (
          <div>
            <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Return</label>
            <input type="date" min={depart} value={ret} onChange={(e) => setRet(e.target.value)} className="input-base" />
          </div>
        ) : (
          <div className="hidden lg:block" />
        )}
      </div>
      <div className="mt-4 flex justify-end">
        <SearchButton onClick={() => onSubmit({ from: from?.code, to: to?.code, depart, ret: trip === 'round' ? ret : '', passengers, class: cls })} />
      </div>
    </div>
  )
}

function HotelForm({ onSubmit }) {
  const [dest, setDest] = useState('')
  const [open, setOpen] = useState(false)
  const [checkIn, setCheckIn] = useState(nextDays(21))
  const [checkOut, setCheckOut] = useState(nextDays(24))
  const [guests, setGuests] = useState(2)
  const [rooms, setRooms] = useState(1)
  const ref = useClickOutside(() => setOpen(false))

  const matches = dest.length >= 1 ? destinations.filter((d) => d.name.toLowerCase().includes(dest.toLowerCase()) || d.country.toLowerCase().includes(dest.toLowerCase())).slice(0, 6) : []

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative" ref={ref}>
          <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Destination</label>
          <input value={dest} onChange={(e) => { setDest(e.target.value); setOpen(true) }} onFocus={() => setOpen(true)} placeholder="Where to?" className="input-base" />
          <AnimatePresence>
            {open && matches.length > 0 && (
              <motion.ul initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="glass-strong absolute z-20 mt-2 w-full overflow-hidden rounded-2xl p-1.5">
                {matches.map((d) => (
                  <li key={d.id}>
                    <button type="button" onClick={() => { setDest(d.name); setOpen(false) }} className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left hover:bg-brand-500/10">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{d.name}</span>
                      <span className="text-xs text-slate-400">{d.country}</span>
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Check In</label>
          <input type="date" min={nextDays(0)} value={checkIn} onChange={(e) => { setCheckIn(e.target.value); if (e.target.value >= checkOut) setCheckOut(addDays(e.target.value, 3)) }} className="input-base" />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Check Out</label>
          <input type="date" min={addDays(checkIn, 1)} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="input-base" />
        </div>
        <div className="flex items-end justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/70 px-4 py-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Guests</p>
            <div className="mt-1"><Stepper value={guests} onChange={setGuests} max={12} /></div>
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Rooms</p>
            <div className="mt-1"><Stepper value={rooms} onChange={setRooms} max={5} /></div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <SearchButton onClick={() => onSubmit({ dest, checkIn, checkOut, guests, rooms })} />
      </div>
    </div>
  )
}

function TourForm({ onSubmit }) {
  const [dest, setDest] = useState('')
  const [type, setType] = useState('')
  const [date, setDate] = useState(nextDays(30))
  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Destination</label>
          <input value={dest} onChange={(e) => setDest(e.target.value)} placeholder="Anywhere in the world" className="input-base" />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Tour Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="input-base">
            <option value="">All Types</option>
            {Object.entries(tourTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Start Date</label>
          <input type="date" min={nextDays(0)} value={date} onChange={(e) => setDate(e.target.value)} className="input-base" />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <SearchButton onClick={() => onSubmit({ dest, type, date })} />
      </div>
    </div>
  )
}

function CarForm({ onSubmit }) {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [pickupDate, setPickupDate] = useState(nextDays(10))
  const [dropDate, setDropDate] = useState(nextDays(13))
  const [type, setType] = useState('')
  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Pickup Location</label>
          <input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Airport or city" className="input-base" />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Drop-off Location</label>
          <input value={dropoff} onChange={(e) => setDropoff(e.target.value)} placeholder="Different location?" className="input-base" />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Pickup Date</label>
          <input type="date" min={nextDays(0)} value={pickupDate} onChange={(e) => { setPickupDate(e.target.value); if (e.target.value >= dropDate) setDropDate(addDays(e.target.value, 3)) }} className="input-base" />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Car Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="input-base">
            <option value="">All Types</option>
            {carTypes.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <SearchButton onClick={() => onSubmit({ pickup, dropoff, pickupDate, dropDate, type })} />
      </div>
    </div>
  )
}

function SearchButton({ onClick }) {
  return (
    <button onClick={onClick} className="btn-primary group !px-10">
      <FaMagnifyingGlass className="transition-transform group-hover:rotate-12" />
      Search
    </button>
  )
}
