import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  FaChevronLeft, FaChevronRight, FaBed, FaPlane, FaCompass, FaCar, FaShip, FaShieldHalved,
  FaUser, FaChair, FaCreditCard, FaCircleCheck, FaCalendarDays, FaUsers,
} from 'react-icons/fa6'
import Breadcrumb from '@/components/common/Breadcrumb'
import Img from '@/components/common/Img'
import Rating from '@/components/common/Rating'
import EmptyState from '@/components/common/EmptyState'
import { useBookings } from '@/context/BookingContext'
import { useApp } from '@/context/AppContext'
import { useCatalog } from '@/context/CatalogContext'
import { getAirline, getAirport } from '@/data/flights'
import { formatDate, formatTime, formatDuration, nextDays, addDays, nightsBetween, daysBetween } from '@/utils/format'
import { recordRecentlyViewed } from '@/services/recentlyViewed'
import { useSEO } from '@/utils/seo'
import { cx } from '@/utils/helpers'

const typeConfig = {
  hotel: { label: 'Hotel', icon: <FaBed />, page: '/hotels' },
  flight: { label: 'Flight', icon: <FaPlane />, page: '/flights' },
  tour: { label: 'Tour', icon: <FaCompass />, page: '/tours' },
  car: { label: 'Car Rental', icon: <FaCar />, page: '/cars' },
  cruise: { label: 'Cruise', icon: <FaShip />, page: '/cruises' },
  insurance: { label: 'Insurance', icon: <FaShieldHalved />, page: '/insurance' },
}

const steps = ['Review', 'Travelers', 'Seats', 'Payment']

export default function Booking() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { draft, setDraft } = useBookings()
  const { formatPrice, convert } = useApp()
  const { getItem } = useCatalog()
  useSEO('Complete Your Booking — Wanderlust', 'Review your trip, add traveler details and proceed to secure checkout.')

  const type = params.get('type') || 'hotel'
  const id = params.get('id')
  const config = typeConfig[type] || typeConfig.hotel

  const item = useMemo(() => getItem(type, id), [type, id, getItem])

  // Booking configuration (dates, guests)
  const [dates, setDates] = useState({
    start: params.get('checkIn') || params.get('depart') || nextDays(21),
    end: params.get('checkOut') || nextDays(24),
  })
  const [guests, setGuests] = useState(Number(params.get('guests')) || Number(params.get('passengers')) || 2)
  const [rooms, setRooms] = useState(Number(params.get('rooms')) || 1)

  const [step, setStep] = useState(0)
  const [travelers, setTravelers] = useState(Array.from({ length: guests }, (_, i) => ({ firstName: '', lastName: '', email: i === 0 ? '' : '', phone: '' })))
  const [seats, setSeats] = useState({})

  // Keep the traveler form count in sync with the guest count
  useEffect(() => {
    setTravelers((prev) =>
      Array.from({ length: guests }, (_, i) => prev[i] || { firstName: '', lastName: '', email: '', phone: '' })
    )
  }, [guests])

  // Track recently viewed items
  useEffect(() => {
    if (item) recordRecentlyViewed(item, type)
  }, [item, type])

  // Pricing
  const { unitPrice, total, nights, days, fee } = useMemo(() => {
    let unitPrice = 0
    let nights = 0
    let days = 0
    if (!item) return { unitPrice: 0, total: 0, nights: 0, days: 0, fee: 0 }
    switch (type) {
      case 'hotel':
        nights = nightsBetween(dates.start, dates.end)
        unitPrice = item.price * nights * rooms
        break
      case 'flight':
        unitPrice = item.price * guests
        break
      case 'tour':
        unitPrice = item.price * guests
        break
      case 'car':
        days = Math.max(1, daysBetween(dates.start, dates.end))
        unitPrice = item.pricePerDay * days
        break
      case 'cruise':
        unitPrice = item.price * guests
        break
      case 'insurance':
        unitPrice = item.price
        break
      default:
        unitPrice = item.price
    }
    const fee = unitPrice * 0.02
    return { unitPrice, total: unitPrice + fee, nights, days, fee }
  }, [item, type, dates, guests, rooms])

  if (!item) {
    return (
      <div className="container-x pt-40">
        <EmptyState title="Booking item not found" text="This item may have been removed or the link is invalid." action={<Link to={config.page} className="btn-primary">Back to {config.label} page</Link>} />
      </div>
    )
  }

  const title = type === 'flight' ? `${item.from} → ${item.to}` : item.name
  const subtitle =
    type === 'hotel' ? `${item.city}, ${item.country}` :
    type === 'flight' ? `${getAirline(item.airline)?.name} · ${item.flightNo} · ${formatTime(item.departTime)} – ${formatTime(item.arriveTime)}` :
    type === 'tour' ? item.destination :
    type === 'car' ? `${item.type} · ${item.transmission}` :
    type === 'cruise' ? `${item.ship} · ${item.departurePort}` : item.tagline

  const next = () => {
    if (step === 1 && !travelers.every((t) => t.firstName && t.lastName)) {
      toast.error('Please complete all traveler details')
      return
    }
    if (step === 2 && type === 'flight') {
      const needed = Object.keys(seats).length
      if (needed < guests) {
        toast.error(`Please select a seat for each of the ${guests} travelers`)
        return
      }
    }
    setStep((s) => Math.min(s + 1, 3))
  }

  const proceedToPayment = () => {
    setDraft({
      type,
      item,
      dates,
      guests,
      rooms,
      travelers,
      seats,
      unitPrice,
      fee,
      total,
      title,
      subtitle,
    })
    navigate('/payment')
  }

  const totalDisplay = formatPrice(total)
  const unitDisplay = formatPrice(
    unitPrice / (type === 'flight' || type === 'tour' || type === 'cruise' ? guests : type === 'hotel' ? nights : type === 'car' ? days : 1)
  )

  return (
    <div className="pt-28">
      <div className="container-x pb-16">
        <div className="mb-6"><Breadcrumb items={[{ label: config.label, to: config.page }, { label: 'Booking' }]} /></div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">Complete your booking</h1>

        {/* Progress steps */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                className={cx(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all',
                  i === step ? 'bg-gradient-to-r from-brand-600 to-ocean-500 text-white shadow-glow' : i < step ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                )}
              >
                {i < step ? <FaCircleCheck /> : <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]">{i + 1}</span>}
                {s}
              </button>
              {i < steps.length - 1 && <span className="h-px w-6 bg-slate-300 dark:bg-slate-700" />}
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main step content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                {step === 0 && (
                  <ReviewStep
                    type={type} item={item} title={title} subtitle={subtitle} dates={dates} setDates={setDates}
                    guests={guests} setGuests={setGuests} rooms={rooms} setRooms={setRooms}
                    unitPrice={unitPrice} unitDisplay={unitDisplay} fee={fee} totalDisplay={totalDisplay} nights={nights} days={days} config={config}
                    formatPrice={formatPrice}
                  />
                )}
                {step === 1 && <TravelersStep type={type} travelers={travelers} setTravelers={setTravelers} />}
                {step === 2 && type === 'flight' && <SeatStep flight={item} guests={guests} seats={seats} setSeats={setSeats} />}
                {step === 2 && type !== 'flight' && (
                  <div className="glass rounded-3xl p-8 text-center">
                    <FaCircleCheck className="mx-auto text-5xl text-emerald-500" />
                    <p className="mt-4 font-display text-xl font-extrabold text-slate-900 dark:text-white">No seat selection needed for this booking</p>
                    <p className="mt-2 text-sm text-slate-500">Seat selection is only available for flights. Continue to payment.</p>
                  </div>
                )}
                {step === 3 && (
                  <div className="glass rounded-3xl p-8">
                    <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">Almost there!</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Review your details and proceed to our secure payment page. We accept all major cards, PayPal, JazzCash and EasyPaisa.</p>
                    <div className="mt-6 space-y-3 rounded-2xl bg-brand-500/5 p-5 text-sm">
                      <p className="flex justify-between"><span className="text-slate-500">Booking</span><span className="font-bold text-slate-900 dark:text-white">{title}</span></p>
                      <p className="flex justify-between"><span className="text-slate-500">Travelers</span><span className="font-bold text-slate-900 dark:text-white">{guests}</span></p>
                      <p className="flex justify-between"><span className="text-slate-500">Dates</span><span className="font-bold text-slate-900 dark:text-white">{formatDate(dates.start)}{type === 'hotel' || type === 'car' ? ` → ${formatDate(dates.end)}` : ''}</span></p>
                      {Object.keys(seats).length > 0 && <p className="flex justify-between"><span className="text-slate-500">Seats</span><span className="font-bold text-slate-900 dark:text-white">{Object.values(seats).join(', ')}</span></p>}
                      <p className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-3"><span className="font-bold text-slate-900 dark:text-white">Total</span><span className="font-display text-lg font-extrabold text-brand-600 dark:text-brand-300">{totalDisplay}</span></p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Nav buttons */}
            <div className="mt-8 flex items-center justify-between">
              <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="btn-outline text-xs disabled:opacity-40">
                <FaChevronLeft /> Back
              </button>
              {step < 3 ? (
                <button onClick={next} className="btn-primary text-xs"><FaChevronRight /> Continue</button>
              ) : (
                <button onClick={proceedToPayment} className="btn-primary text-xs !px-10">
                  <FaCreditCard /> Proceed to Payment
                </button>
              )}
            </div>
          </div>

          {/* Summary sidebar */}
          <aside className="h-fit lg:sticky lg:top-28">
            <div className="glass overflow-hidden rounded-3xl">
              <div className="relative h-44">
                <Img src={item.image} seed={`bk-${type}-${id}`} alt={title} className="h-full w-full object-cover" />
                <span className="badge-float left-3 top-3 bg-gradient-to-r from-brand-600 to-ocean-500 text-white">{config.label}</span>
              </div>
              <div className="p-5">
                <h3 className="line-clamp-1 font-display text-lg font-extrabold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{subtitle}</p>
                {item.rating && <Rating value={item.rating} count={item.reviews} size="xs" className="mt-2" />}
                <div className="mt-5 space-y-2.5 border-t border-slate-100 dark:border-slate-800 pt-4 text-sm">
                  <p className="flex items-center gap-2 text-slate-500 dark:text-slate-400"><FaCalendarDays className="text-brand-500" /> {formatDate(dates.start)}{(type === 'hotel' || type === 'car') ? ` – ${formatDate(dates.end)}` : ''}</p>
                  <p className="flex items-center gap-2 text-slate-500 dark:text-slate-400"><FaUsers className="text-brand-500" /> {guests} {guests === 1 ? 'traveler' : 'travelers'}{type === 'hotel' ? ` · ${rooms} room${rooms > 1 ? 's' : ''}` : ''}</p>
                  {type === 'hotel' && <p className="flex items-center gap-2 text-slate-500 dark:text-slate-400">{nights} night{nights > 1 ? 's' : ''}</p>}
                  {type === 'flight' && <p className="flex items-center gap-2 text-slate-500 dark:text-slate-400"><FaPlane className="text-brand-500" /> {formatDuration(item.duration)} · {item.stops === 0 ? 'Non-stop' : `${item.stops} stop`}</p>}
                </div>
                <div className="mt-5 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 text-sm">
                  <p className="flex justify-between text-slate-500"><span>Subtotal</span><span className="font-bold text-slate-900 dark:text-white">{formatPrice(unitPrice)}</span></p>
                  <p className="flex justify-between text-slate-500"><span>Service fee (2%)</span><span className="font-bold text-slate-900 dark:text-white">{formatPrice(fee)}</span></p>
                  <p className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 font-display text-base font-extrabold text-slate-900 dark:text-white">
                    <span>Total</span><span className="text-gradient">{totalDisplay}</span>
                  </p>
                </div>
                <button onClick={() => setStep(3)} className="btn-primary mt-5 w-full text-xs"><FaCreditCard /> {step === 3 ? 'Go to payment' : 'Continue to payment'}</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

/* ── Step components ──────────────────────────────────────────────────────── */

function ReviewStep({ type, item, title, subtitle, dates, setDates, guests, setGuests, rooms, setRooms, unitPrice, unitDisplay, fee, totalDisplay, nights, days, config, formatPrice }) {
  return (
    <div className="glass rounded-3xl p-6">
      <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">1 · Review your trip</h3>
      <p className="mt-1 text-sm text-slate-500">Confirm the details below — you can adjust dates and guests here.</p>
      <div className="mt-6 space-y-5">
        <div className="flex items-center gap-4 rounded-2xl bg-brand-500/5 p-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-ocean-500 text-lg text-white">{config.icon}</span>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-extrabold text-slate-900 dark:text-white">{title}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
          <span className="ml-auto shrink-0 font-display text-lg font-extrabold text-brand-600 dark:text-brand-300">{unitDisplay}<span className="text-[10px] font-semibold text-slate-400">{type === 'hotel' ? '/night' : type === 'car' ? '/day' : type === 'flight' || type === 'tour' || type === 'cruise' ? '/person' : ''}</span></span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500">Start date</label>
            <input type="date" value={dates.start} min={nextDays(0)} onChange={(e) => { setDates((d) => ({ ...d, start: e.target.value })); if (e.target.value >= dates.end) setDates((d) => ({ ...d, end: addDays(e.target.value, type === 'hotel' ? 3 : 1) })) }} className="input-base" />
          </div>
          {(type === 'hotel' || type === 'car') && (
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-500">End date</label>
              <input type="date" value={dates.end} min={addDays(dates.start, 1)} onChange={(e) => setDates((d) => ({ ...d, end: e.target.value }))} className="input-base" />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500">{type === 'flight' ? 'Passengers' : 'Travelers'}</label>
            <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="input-base !w-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          {type === 'hotel' && (
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-500">Rooms</label>
              <select value={rooms} onChange={(e) => setRooms(Number(e.target.value))} className="input-base !w-auto">
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          )}
          {type === 'flight' && (
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-500">Cabin class</label>
              <div className="chip bg-brand-500/10 text-brand-600 dark:text-brand-300">{item.class}</div>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 text-sm">
          <p className="flex justify-between text-slate-500"><span>Subtotal</span><span className="font-bold text-slate-900 dark:text-white">{formatPrice(unitPrice)}</span></p>
          <p className="mt-1 flex justify-between text-slate-500"><span>Service fee</span><span className="font-bold text-slate-900 dark:text-white">{formatPrice(fee)}</span></p>
          <p className="mt-2 flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 font-display text-base font-extrabold text-slate-900 dark:text-white"><span>Total</span><span className="text-gradient">{totalDisplay}</span></p>
        </div>
      </div>
    </div>
  )
}

function TravelersStep({ type, travelers, setTravelers }) {
  const { register } = useForm()
  const update = (i, field, value) => setTravelers((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)))

  return (
    <div className="glass rounded-3xl p-6">
      <h3 className="flex items-center gap-2 font-display text-lg font-extrabold text-slate-900 dark:text-white">
        <FaUser className="text-brand-500" /> 2 · Traveler details
      </h3>
      <p className="mt-1 text-sm text-slate-500">Enter the details exactly as they appear on the passport / ID.</p>
      <div className="mt-6 space-y-6">
        {travelers.map((t, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 text-[10px]">{i + 1}</span>
              Traveler {i + 1}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-500">First name *</label>
                <input value={t.firstName} onChange={(e) => update(i, 'firstName', e.target.value)} placeholder="Jane" className="input-base" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-500">Last name *</label>
                <input value={t.lastName} onChange={(e) => update(i, 'lastName', e.target.value)} placeholder="Doe" className="input-base" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-500">Email</label>
                <input value={t.email} onChange={(e) => update(i, 'email', e.target.value)} placeholder="jane@example.com" className="input-base" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-500">Phone</label>
                <input value={t.phone} onChange={(e) => update(i, 'phone', e.target.value)} placeholder="+1 555 000 0000" className="input-base" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SeatStep({ flight, guests, seats, setSeats }) {
  const [taken, setTaken] = useState(() => {
    const seed = flight.flightNo
    const set = new Set()
    let h = 0
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 997
    for (let i = 0; i < 22; i++) {
      h = (h * 31 + 7) % 997
      const row = 1 + (h % 30)
      const col = ['A', 'B', 'C', 'D', 'E', 'F'][h % 6]
      set.add(`${row}${col}`)
    }
    return set
  })

  const seatCount = Object.keys(seats).length

  const toggle = (seat) => {
    if (taken.has(seat)) return
    setSeats((prev) => {
      const next = { ...prev }
      if (next[seat]) {
        delete next[seat]
        return next
      }
      if (Object.keys(next).length >= guests) {
        toast.error(`Only ${guests} seat${guests > 1 ? 's' : ''} needed`)
        return prev
      }
      next[seat] = seat
      return next
    })
  }

  const renderRow = (row, cols, isBusiness) => (
    <div key={row} className="flex items-center justify-center gap-1.5">
      <span className="w-6 text-center text-[10px] font-bold text-slate-400">{row}</span>
      {cols.map((c) => {
        const seat = `${row}${c}`
        const isTaken = taken.has(seat)
        const isSelected = !!seats[seat]
        return (
          <button
            key={c}
            onClick={() => toggle(seat)}
            disabled={isTaken}
            className={cx(
              'h-8 w-8 rounded-lg text-[10px] font-bold transition-all duration-150 sm:h-9 sm:w-9',
              isSelected
                ? 'bg-gradient-to-r from-brand-600 to-ocean-500 text-white shadow-glow scale-110'
                : isTaken
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-brand-500 hover:text-white hover:border-transparent'
            )}
          >
            {c}
          </button>
        )
      })}
      <span className="w-6 text-center text-[10px] font-bold text-slate-400">{row}</span>
    </div>
  )

  return (
    <div className="glass rounded-3xl p-6">
      <h3 className="flex items-center gap-2 font-display text-lg font-extrabold text-slate-900 dark:text-white">
        <FaChair className="text-brand-500" /> 3 · Choose your seats
      </h3>
      <p className="mt-1 text-sm text-slate-500">Select {guests} seat{guests > 1 ? 's' : ''} on {flight.flightNo}. Selected: {seatCount}/{guests}.</p>

      <div className="mt-6 flex flex-col items-center gap-3">
        <p className="mb-2 flex items-center gap-4 text-[11px] font-bold text-slate-500">
          <span className="flex items-center gap-1.5"><span className="h-4 w-4 rounded bg-white border border-slate-300 dark:border-slate-600" /> Available</span>
          <span className="flex items-center gap-1.5"><span className="h-4 w-4 rounded bg-gradient-to-r from-brand-600 to-ocean-500" /> Selected</span>
          <span className="flex items-center gap-1.5"><span className="h-4 w-4 rounded bg-slate-300 dark:bg-slate-700" /> Taken</span>
        </p>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 p-5">
          <p className="mb-4 text-center text-[10px] font-extrabold uppercase tracking-[0.3em] text-slate-400">Business Class</p>
          <div className="space-y-2">{[1, 2, 3, 4].map((r) => renderRow(r, ['A', 'B', 'E', 'F'], true))}</div>
          <div className="my-4 h-px bg-slate-200 dark:bg-slate-700" />
          <p className="mb-4 text-center text-[10px] font-extrabold uppercase tracking-[0.3em] text-slate-400">Economy</p>
          <div className="space-y-2">
            {Array.from({ length: 26 }, (_, i) => i + 5).map((r) => renderRow(r, ['A', 'B', 'C', 'D', 'E', 'F'], false))}
          </div>
        </div>
      </div>
    </div>
  )
}
