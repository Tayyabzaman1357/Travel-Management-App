import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FaGaugeHigh, FaBed, FaPlane, FaCompass, FaLocationDot, FaTicket, FaUsers, FaStar,
  FaTags, FaNewspaper, FaGear, FaCoins, FaDownload, FaCircleInfo,
} from 'react-icons/fa6'
import Sidebar from '@/components/layout/Sidebar'
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import { useBookings } from '@/context/BookingContext'
import { AdminStat, AdminTable, EditorModal, Thumb, StatusPill, Donut, BarChart } from './adminHelpers'
import { tourTypeLabels } from '@/data/tours'
import { blogPosts, blogCategories } from '@/data/blogPosts'
import { hotelService, flightService, tourService, destinationService } from '@/services/catalogService'
import { couponService, bookingService } from '@/services/bookingService'
import { reviewService } from '@/services/reviewService'
import { userService } from '@/services/userService'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useSEO } from '@/utils/seo'
import { formatDate, timeAgo } from '@/utils/format'
import { uid, cx, downloadJson } from '@/utils/helpers'

const toastError = (e, fallback) => toast.error(e?.message || fallback)

export default function AdminDashboard() {
  useSEO('Admin Dashboard — Wanderlust', 'Manage hotels, flights, tours, users, bookings and more.')
  const { user } = useAuth()
  const { formatPrice, currency } = useApp()
  const { bookings: myBookings, refresh } = useBookings()
  const [section, setSection] = useState('overview')

  // Catalog entities (backend-managed)
  const [hotelData, setHotelData] = useState([])
  const [flightData, setFlightData] = useState([])
  const [tourData, setTourData] = useState([])
  const [destData, setDestData] = useState([])
  // Blog stays local (no backend model requested)
  const [blogData, setBlogData] = useLocalStorage('wanderlust-admin-blog', blogPosts)

  // Live collections
  const [allBookings, setAllBookings] = useState([])
  const [users, setUsers] = useState([])
  const [reviews, setReviews] = useState([])
  const [coupons, setCoupons] = useState([])
  const [loadingDb, setLoadingDb] = useState(true)

  const loadAll = () => {
    setLoadingDb(true)
    Promise.all([
      hotelService.list(),
      flightService.list(),
      tourService.list(),
      destinationService.list(),
      bookingService.getAllBookings(),
      userService.list(),
      reviewService.getAll(),
      couponService.getAll(),
    ])
      .then(([h, f, t, d, b, u, r, c]) => {
        setHotelData(h)
        setFlightData(f)
        setTourData(t)
        setDestData(d)
        setAllBookings(b)
        setUsers(u)
        setReviews(r)
        setCoupons(c)
      })
      .catch((e) => toastError(e, 'Could not load admin data'))
      .finally(() => setLoadingDb(false))
  }

  useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const bookings = [...allBookings, ...myBookings.filter((mb) => !allBookings.some((ab) => ab.id === mb.id))]

  const analytics = useMemo(() => {
    const revenue = bookings.filter((b) => b.status !== 'cancelled').reduce((a, b) => a + (b.total || 0), 0)
    const byType = ['flight', 'hotel', 'tour', 'car', 'cruise', 'insurance'].map((t) => ({ label: t, value: bookings.filter((b) => b.type === t).length, color: { flight: '#6366f1', hotel: '#06b6d4', tour: '#f59e0b', car: '#10b981', cruise: '#a855f7', insurance: '#f43f5e' }[t] })).filter((s) => s.value > 0)
    const monthly = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date()
      d.setMonth(d.getMonth() - (5 - i))
      const key = `${d.getMonth()}-${d.getFullYear()}`
      return { label: d.toLocaleString('en-US', { month: 'short' }), value: bookings.filter((b) => { const bd = new Date(b.createdAt); return `${bd.getMonth()}-${bd.getFullYear()}` === key }).reduce((a, b) => a + (b.total || 0), 0) }
    })
    return { revenue, byType, monthly, active: bookings.filter((b) => b.status === 'confirmed').length }
  }, [bookings])

  const items = [
    { key: 'overview', label: 'Overview', icon: <FaGaugeHigh /> },
    { key: 'hotels', label: 'Hotels', icon: <FaBed />, badge: hotelData.length },
    { key: 'flights', label: 'Flights', icon: <FaPlane />, badge: flightData.length },
    { key: 'tours', label: 'Tours', icon: <FaCompass />, badge: tourData.length },
    { key: 'destinations', label: 'Destinations', icon: <FaLocationDot />, badge: destData.length },
    { key: 'bookings', label: 'Bookings', icon: <FaTicket />, badge: bookings.length },
    { key: 'users', label: 'Users', icon: <FaUsers />, badge: users.length },
    { key: 'reviews', label: 'Reviews', icon: <FaStar />, badge: reviews.length },
    { key: 'coupons', label: 'Coupons', icon: <FaTags />, badge: coupons.length },
    { key: 'blog', label: 'Blog Posts', icon: <FaNewspaper />, badge: blogData.length },
    { key: 'settings', label: 'Settings', icon: <FaGear /> },
  ]

  const sectionProps = {
    hotelData, setHotelData, flightData, setFlightData, tourData, setTourData, destData, setDestData, blogData, setBlogData,
    allBookings: bookings, setAllBookings, users, setUsers, reviews, setReviews, coupons, setCoupons,
    loadingDb, formatPrice, currency, refresh,
  }

  return (
    <div className="container-x pt-28 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back, {user?.name?.split(' ')[0]} — here's what's happening today.</p>
        </div>
        <span className="chip bg-brand-500/10 text-brand-600 dark:text-brand-300">Administrator access</span>
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <Sidebar items={items} activeKey={section} onChange={setSection} title="Admin Panel" />
        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
              {section === 'overview' && <Overview analytics={analytics} bookings={bookings} formatPrice={formatPrice} usersCount={users.length} hotelsCount={hotelData.length} />}
              {section === 'hotels' && <HotelsSection {...sectionProps} />}
              {section === 'flights' && <FlightsSection {...sectionProps} />}
              {section === 'tours' && <ToursSection {...sectionProps} />}
              {section === 'destinations' && <DestinationsSection {...sectionProps} />}
              {section === 'bookings' && <BookingsSection {...sectionProps} />}
              {section === 'users' && <UsersSection {...sectionProps} />}
              {section === 'reviews' && <ReviewsSection {...sectionProps} />}
              {section === 'coupons' && <CouponsSection {...sectionProps} />}
              {section === 'blog' && <BlogSection {...sectionProps} />}
              {section === 'settings' && <SettingsSection {...sectionProps} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ── Sections ─────────────────────────────────────────────────────────────── */

function Overview({ analytics, bookings, formatPrice, usersCount, hotelsCount }) {
  const recent = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <AdminStat label="Total revenue" value={formatPrice(analytics.revenue)} icon={<FaCoins />} trend={12.4} sub="vs. last month" />
        <AdminStat label="Total bookings" value={bookings.length} icon={<FaTicket />} trend={8.1} sub="all time" />
        <AdminStat label="Active bookings" value={analytics.active} icon={<FaPlane />} trend={-2.3} sub="confirmed trips" />
        <AdminStat label="Registered users" value={usersCount} icon={<FaUsers />} trend={5.7} sub={`across ${hotelsCount} hotels`} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="glass rounded-3xl p-6 lg:col-span-3">
          <h3 className="mb-5 font-display text-lg font-extrabold text-slate-900 dark:text-white">Revenue (last 6 months)</h3>
          <BarChart data={analytics.monthly} />
        </div>
        <div className="glass rounded-3xl p-6 lg:col-span-2">
          <h3 className="mb-5 font-display text-lg font-extrabold text-slate-900 dark:text-white">Bookings by type</h3>
          {analytics.byType.length ? <Donut segments={analytics.byType} /> : <p className="text-sm text-slate-500">No booking data yet.</p>}
        </div>
      </div>

      <div className="glass rounded-3xl p-6">
        <h3 className="mb-4 font-display text-lg font-extrabold text-slate-900 dark:text-white">Recent bookings</h3>
        {recent.length === 0 ? (
          <p className="text-sm text-slate-500">No bookings yet — they will appear here once customers book.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="px-3 py-2 font-bold">Reference</th>
                  <th className="px-3 py-2 font-bold">Item</th>
                  <th className="px-3 py-2 font-bold">Customer</th>
                  <th className="px-3 py-2 font-bold">Date</th>
                  <th className="px-3 py-2 font-bold">Total</th>
                  <th className="px-3 py-2 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((b) => (
                  <tr key={b.id} className="border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                    <td className="px-3 py-2.5 font-mono text-xs font-bold text-brand-600">{b.reference}</td>
                    <td className="max-w-[180px] truncate px-3 py-2.5 font-semibold text-slate-800 dark:text-slate-100">{b.itemName}</td>
                    <td className="px-3 py-2.5 text-slate-500">{b.travelers?.[0]?.name || 'Guest'}</td>
                    <td className="px-3 py-2.5 text-slate-500">{formatDate(b.date)}</td>
                    <td className="px-3 py-2.5 font-bold text-slate-900 dark:text-white">{formatPrice(b.total)}</td>
                    <td className="px-3 py-2.5"><StatusPill status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function HotelsSection({ hotelData, setHotelData, formatPrice }) {
  const [editing, setEditing] = useState(null)
  const [open, setOpen] = useState(false)

  const save = async (form) => {
    try {
      if (editing) {
        const updated = await hotelService.update(editing.id, form)
        setHotelData((prev) => prev.map((h) => (h.id === updated.id ? updated : h)))
        toast.success('Hotel updated')
      } else {
        const created = await hotelService.create({
          ...form,
          rating: Number(form.rating) || 4.5,
          reviews: 0,
          coords: { lat: 48.8566, lng: 2.3522 },
          gallery: [form.image],
          amenities: (form.amenities || '').split(',').map((s) => s.trim()).filter(Boolean),
        })
        setHotelData((prev) => [created, ...prev])
        toast.success('Hotel added')
      }
      setOpen(false)
    } catch (e) {
      toastError(e, 'Could not save hotel')
    }
  }

  const fields = [
    { key: 'name', label: 'Hotel name', required: true, full: true },
    { key: 'city', label: 'City', required: true },
    { key: 'country', label: 'Country', required: true },
    { key: 'price', label: 'Price / night (USD)', type: 'number', min: 1, required: true },
    { key: 'rating', label: 'Rating', type: 'number', min: 0, step: 0.1 },
    { key: 'image', label: 'Image URL', full: true },
    { key: 'amenities', label: 'Amenities (comma separated)', full: true, placeholder: 'pool, wifi, restaurant, spa' },
  ]

  return (
    <div>
      <AdminTable
        title="Manage Hotels" subtitle="Add, edit and remove hotel listings"
        columns={[
          { key: 'name', label: 'Hotel', render: (h) => <Thumb src={h.image} seed={`ah-${h.id}`} name={h.name} /> },
          { key: 'location', label: 'Location', render: (h) => `${h.city}, ${h.country}` },
          { key: 'price', label: 'Price', sortable: true, render: (h) => <span className="font-bold">{formatPrice(h.price)}</span> },
          { key: 'rating', label: 'Rating', sortable: true, render: (h) => <span className="font-bold text-amber-500">★ {h.rating}</span> },
          { key: 'reviews', label: 'Reviews', sortable: true },
          { key: 'amenities', label: 'Amenities', render: (h) => <span className="text-xs text-slate-500">{(h.amenities || []).slice(0, 3).join(', ')}{h.amenities?.length > 3 ? ` +${h.amenities.length - 3}` : ''}</span> },
        ]}
        rows={hotelData}
        searchKeys={['name', 'city', 'country']}
        onAdd={() => { setEditing(null); setOpen(true) }}
        onEdit={(row) => { setEditing(row); setOpen(true) }}
        onDelete={async (row) => {
          try { await hotelService.remove(row.id); setHotelData((prev) => prev.filter((h) => h.id !== row.id)); toast.success('Hotel removed') } catch (e) { toastError(e, 'Could not delete hotel') }
        }}
        addLabel="Add hotel"
      />
      <EditorModal
        open={open} onClose={() => setOpen(false)} title={editing ? 'Edit hotel' : 'Add hotel'} fields={fields}
        values={editing ? { ...editing, amenities: (editing.amenities || []).join(', ') } : {}}
        onSubmit={save} submitLabel={editing ? 'Update hotel' : 'Add hotel'}
      />
    </div>
  )
}

function FlightsSection({ flightData, setFlightData, formatPrice }) {
  const [editing, setEditing] = useState(null)
  const [open, setOpen] = useState(false)
  const save = async (form) => {
    try {
      if (editing) {
        const updated = await flightService.update(editing.id, form)
        setFlightData((prev) => prev.map((f) => (f.id === updated.id ? updated : f)))
        toast.success('Flight updated')
      } else {
        const created = await flightService.create({
          ...form,
          duration: Number(form.duration) || 300,
          stops: Number(form.stops) || 0,
          seatsLeft: Number(form.seatsLeft) || 10,
          date: form.date || new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
          baggage: '23kg',
        })
        setFlightData((prev) => [created, ...prev])
        toast.success('Flight added')
      }
      setOpen(false)
    } catch (e) {
      toastError(e, 'Could not save flight')
    }
  }
  const fields = [
    { key: 'airline', label: 'Airline code', required: true, placeholder: 'QR' },
    { key: 'flightNo', label: 'Flight no', required: true, placeholder: 'QR 831' },
    { key: 'from', label: 'From (city)', required: true },
    { key: 'to', label: 'To (city)', required: true },
    { key: 'fromCode', label: 'From code', required: true, placeholder: 'JFK' },
    { key: 'toCode', label: 'To code', required: true, placeholder: 'CDG' },
    { key: 'departTime', label: 'Departure time', required: true, placeholder: '07:30' },
    { key: 'arriveTime', label: 'Arrival time', required: true, placeholder: '20:45' },
    { key: 'duration', label: 'Duration (min)', type: 'number' },
    { key: 'stops', label: 'Stops', type: 'number' },
    { key: 'price', label: 'Price (USD)', type: 'number', required: true },
    { key: 'class', label: 'Class', type: 'select', options: ['Economy', 'Premium', 'Business', 'First'] },
    { key: 'seatsLeft', label: 'Seats left', type: 'number' },
    { key: 'date', label: 'Date', type: 'date' },
  ]
  return (
    <div>
      <AdminTable
        title="Manage Flights" subtitle="Add, edit and remove flight routes"
        columns={[
          { key: 'flightNo', label: 'Flight', render: (f) => <div><p className="font-bold text-slate-800 dark:text-slate-100">{f.flightNo}</p><p className="text-xs text-slate-400">{f.airline}</p></div> },
          { key: 'route', label: 'Route', render: (f) => <span className="font-semibold">{f.fromCode} → {f.toCode}</span> },
          { key: 'time', label: 'Time', render: (f) => <span className="text-xs">{f.departTime} – {f.arriveTime}</span> },
          { key: 'stops', label: 'Stops', sortable: true, render: (f) => (f.stops === 0 ? 'Non-stop' : f.stops) },
          { key: 'price', label: 'Price', sortable: true, render: (f) => <span className="font-bold">{formatPrice(f.price)}</span> },
          { key: 'seatsLeft', label: 'Seats', sortable: true, render: (f) => <span className={cx('font-bold', f.seatsLeft <= 8 ? 'text-accent-500' : 'text-emerald-500')}>{f.seatsLeft}</span> },
        ]}
        rows={flightData}
        searchKeys={['flightNo', 'from', 'to', 'airline']}
        onAdd={() => { setEditing(null); setOpen(true) }}
        onEdit={(row) => { setEditing(row); setOpen(true) }}
        onDelete={async (row) => {
          try { await flightService.remove(row.id); setFlightData((prev) => prev.filter((f) => f.id !== row.id)); toast.success('Flight removed') } catch (e) { toastError(e, 'Could not delete flight') }
        }}
        addLabel="Add flight"
      />
      <EditorModal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit flight' : 'Add flight'} fields={fields} values={editing || {}} onSubmit={save} submitLabel={editing ? 'Update flight' : 'Add flight'} />
    </div>
  )
}

function ToursSection({ tourData, setTourData, formatPrice }) {
  const [editing, setEditing] = useState(null)
  const [open, setOpen] = useState(false)
  const save = async (form) => {
    try {
      if (editing) {
        const updated = await tourService.update(editing.id, form)
        setTourData((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
        toast.success('Tour updated')
      } else {
        const created = await tourService.create({
          ...form,
          rating: Number(form.rating) || 4.8,
          reviews: 0,
          groupSize: Number(form.groupSize) || 12,
          included: [],
        })
        setTourData((prev) => [created, ...prev])
        toast.success('Tour added')
      }
      setOpen(false)
    } catch (e) {
      toastError(e, 'Could not save tour')
    }
  }
  const fields = [
    { key: 'name', label: 'Tour name', required: true, full: true },
    { key: 'destination', label: 'Destination', required: true },
    { key: 'type', label: 'Type', type: 'select', required: true, options: Object.keys(tourTypeLabels) },
    { key: 'duration', label: 'Duration', placeholder: '5 Days' },
    { key: 'price', label: 'Price (USD)', type: 'number', required: true },
    { key: 'groupSize', label: 'Max group size', type: 'number' },
    { key: 'rating', label: 'Rating', type: 'number', step: 0.1 },
    { key: 'image', label: 'Image URL', full: true },
  ]
  return (
    <div>
      <AdminTable
        title="Manage Tours" subtitle="Add, edit and remove tour packages"
        columns={[
          { key: 'name', label: 'Tour', render: (t) => <Thumb src={t.image} seed={`at-${t.id}`} name={t.name} /> },
          { key: 'destination', label: 'Destination' },
          { key: 'type', label: 'Type', render: (t) => <span className="capitalize">{t.type}</span> },
          { key: 'duration', label: 'Duration' },
          { key: 'price', label: 'Price', sortable: true, render: (t) => <span className="font-bold">{formatPrice(t.price)}</span> },
          { key: 'rating', label: 'Rating', sortable: true, render: (t) => <span className="font-bold text-amber-500">★ {t.rating}</span> },
        ]}
        rows={tourData}
        searchKeys={['name', 'destination', 'type']}
        onAdd={() => { setEditing(null); setOpen(true) }}
        onEdit={(row) => { setEditing(row); setOpen(true) }}
        onDelete={async (row) => {
          try { await tourService.remove(row.id); setTourData((prev) => prev.filter((t) => t.id !== row.id)); toast.success('Tour removed') } catch (e) { toastError(e, 'Could not delete tour') }
        }}
        addLabel="Add tour"
      />
      <EditorModal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit tour' : 'Add tour'} fields={fields} values={editing || {}} onSubmit={save} submitLabel={editing ? 'Update tour' : 'Add tour'} />
    </div>
  )
}

function DestinationsSection({ destData, setDestData, formatPrice }) {
  const [editing, setEditing] = useState(null)
  const [open, setOpen] = useState(false)
  const save = async (form) => {
    try {
      if (editing) {
        const updated = await destinationService.update(editing.id, form)
        setDestData((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
        toast.success('Destination updated')
      } else {
        const created = await destinationService.create({
          ...form,
          rating: Number(form.rating) || 4.7,
          reviews: 0,
          tags: [],
          gallery: [form.image],
          coords: { lat: 48.8566, lng: 2.3522 },
        })
        setDestData((prev) => [created, ...prev])
        toast.success('Destination added')
      }
      setOpen(false)
    } catch (e) {
      toastError(e, 'Could not save destination')
    }
  }
  const fields = [
    { key: 'name', label: 'City', required: true },
    { key: 'country', label: 'Country', required: true },
    { key: 'region', label: 'Region' },
    { key: 'price', label: 'Starting price (USD)', type: 'number', required: true },
    { key: 'rating', label: 'Rating', type: 'number', step: 0.1 },
    { key: 'image', label: 'Image URL', full: true },
    { key: 'description', label: 'Description', type: 'textarea', full: true },
  ]
  return (
    <div>
      <AdminTable
        title="Manage Destinations" subtitle="Curate the destinations catalog"
        columns={[
          { key: 'name', label: 'Destination', render: (d) => <Thumb src={d.image} seed={`ad-${d.id}`} name={d.name} /> },
          { key: 'country', label: 'Country' },
          { key: 'region', label: 'Region' },
          { key: 'price', label: 'From', sortable: true, render: (d) => <span className="font-bold">{formatPrice(d.price)}</span> },
          { key: 'rating', label: 'Rating', sortable: true, render: (d) => <span className="font-bold text-amber-500">★ {d.rating}</span> },
        ]}
        rows={destData}
        searchKeys={['name', 'country', 'region']}
        onAdd={() => { setEditing(null); setOpen(true) }}
        onEdit={(row) => { setEditing(row); setOpen(true) }}
        onDelete={async (row) => {
          try { await destinationService.remove(row.id); setDestData((prev) => prev.filter((d) => d.id !== row.id)); toast.success('Destination removed') } catch (e) { toastError(e, 'Could not delete destination') }
        }}
        addLabel="Add destination"
      />
      <EditorModal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit destination' : 'Add destination'} fields={fields} values={editing || {}} onSubmit={save} submitLabel={editing ? 'Update destination' : 'Add destination'} />
    </div>
  )
}

function BookingsSection({ allBookings, setAllBookings, formatPrice, loadingDb }) {
  const changeStatus = async (id, status) => {
    try {
      await bookingService.updateStatus(id, status)
      setAllBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
      toast.success(`Booking marked as ${status}`)
    } catch (e) {
      toastError(e, 'Could not update booking')
    }
  }
  return (
    <AdminTable
      title="Manage Bookings" subtitle="View and update all customer bookings"
      loading={loadingDb}
      columns={[
        { key: 'reference', label: 'Reference', render: (b) => <span className="font-mono text-xs font-bold text-brand-600">{b.reference}</span> },
        { key: 'itemName', label: 'Item', render: (b) => <span className="max-w-[200px] truncate font-semibold">{b.itemName}</span> },
        { key: 'type', label: 'Type', render: (b) => <span className="capitalize">{b.type}</span> },
        { key: 'travelers', label: 'Customer', render: (b) => b.travelers?.[0]?.name || 'Guest' },
        { key: 'date', label: 'Date', render: (b) => formatDate(b.date) },
        { key: 'total', label: 'Total', sortable: true, render: (b) => <span className="font-bold">{formatPrice(b.total)}</span> },
        { key: 'status', label: 'Status', render: (b) => (
          <select value={b.status} onChange={(e) => changeStatus(b.id, e.target.value)} className={cx('input-base !w-auto !px-2 !py-1 text-xs font-bold capitalize')}>
            {['confirmed', 'pending', 'completed', 'cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        ) },
      ]}
      rows={allBookings}
      searchKeys={['reference', 'itemName', 'type']}
      onDelete={async (row) => {
        try { await bookingService.deleteBooking(row.id); setAllBookings((prev) => prev.filter((b) => b.id !== row.id)); toast.success('Booking deleted') } catch (e) { toastError(e, 'Could not delete booking') }
      }}
    />
  )
}

function UsersSection({ users, setUsers, loadingDb }) {
  const changeRole = async (id, role) => {
    try {
      const u = await userService.update(id, { role })
      setUsers((prev) => prev.map((x) => (x.id === id ? u : x)))
      toast.success(`Role updated to ${role}`)
    } catch (e) {
      toastError(e, 'Could not update role')
    }
  }
  return (
    <AdminTable
      title="Manage Users" subtitle="All registered users and their roles"
      loading={loadingDb}
      columns={[
        { key: 'name', label: 'User', render: (u) => <Thumb src={u.photoURL} seed={`au-${u.id}`} name={u.name} /> },
        { key: 'email', label: 'Email' },
        { key: 'provider', label: 'Provider', render: (u) => <span className="capitalize">{u.provider}</span> },
        { key: 'joined', label: 'Joined', render: (u) => formatDate(u.createdAt) },
        { key: 'role', label: 'Role', render: (u) => (
          <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)} className="input-base !w-auto !px-2 !py-1 text-xs font-bold capitalize">
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        ) },
      ]}
      rows={users}
      searchKeys={['name', 'email', 'role']}
      onDelete={async (row) => {
        try { await userService.remove(row.id); setUsers((prev) => prev.filter((u) => u.id !== row.id)); toast.success('User removed') } catch (e) { toastError(e, 'Could not delete user') }
      }}
    />
  )
}

function ReviewsSection({ reviews, setReviews, loadingDb }) {
  return (
    <AdminTable
      title="Manage Reviews" subtitle="Moderate customer reviews"
      loading={loadingDb}
      columns={[
        { key: 'userName', label: 'Customer' },
        { key: 'title', label: 'Title', render: (r) => <span className="font-semibold">{r.title || '—'}</span> },
        { key: 'text', label: 'Review', render: (r) => <span className="block max-w-[280px] truncate text-xs text-slate-500">{r.text}</span> },
        { key: 'rating', label: 'Rating', sortable: true, render: (r) => <span className="font-bold text-amber-500">★ {r.rating}</span> },
        { key: 'date', label: 'Date', render: (r) => timeAgo(r.createdAt || r.date) },
        { key: 'status', label: 'Status', render: () => <StatusPill status="published" /> },
      ]}
      rows={reviews}
      searchKeys={['userName', 'title', 'text']}
      onDelete={async (row) => {
        try { await reviewService.remove(row.id); setReviews((prev) => prev.filter((r) => r.id !== row.id)); toast.success('Review removed') } catch (e) { toastError(e, 'Could not delete review') }
      }}
    />
  )
}

function CouponsSection({ coupons, setCoupons, formatPrice }) {
  const [open, setOpen] = useState(false)
  const save = async (form) => {
    const c = await couponService.add(form)
    setCoupons((prev) => [c, ...prev])
    setOpen(false)
    toast.success(`Coupon ${form.code} created`)
  }
  const fields = [
    { key: 'code', label: 'Coupon code', required: true, placeholder: 'SUMMER25' },
    { key: 'title', label: 'Title', required: true },
    { key: 'discount', label: 'Discount %', type: 'number', min: 1, max: 90, required: true },
    { key: 'category', label: 'Category', required: true },
    { key: 'type', label: 'Type', type: 'select', options: ['Coupon', 'Promo', 'Seasonal'] },
    { key: 'expiry', label: 'Expiry date', type: 'date' },
  ]
  return (
    <div>
      <AdminTable
        title="Manage Coupons" subtitle="Create and track promotional codes"
        loading={false}
        columns={[
          { key: 'code', label: 'Code', render: (c) => <span className="rounded-lg bg-brand-500/10 px-2.5 py-1 font-mono text-xs font-extrabold text-brand-600 dark:text-brand-300">{c.code}</span> },
          { key: 'title', label: 'Title' },
          { key: 'category', label: 'Category' },
          { key: 'discount', label: 'Discount', sortable: true, render: (c) => <span className="font-bold text-emerald-500">{c.discount}%</span> },
          { key: 'type', label: 'Type' },
          { key: 'expiry', label: 'Expires', render: (c) => formatDate(c.expiry) },
        ]}
        rows={coupons}
        searchKeys={['code', 'title', 'category']}
        onAdd={() => setOpen(true)}
        onDelete={async (row) => { await couponService.remove(row.id); setCoupons((prev) => prev.filter((c) => c.id !== row.id)); toast.success('Coupon removed') }}
        addLabel="Add coupon"
      />
      <EditorModal open={open} onClose={() => setOpen(false)} title="Add coupon" fields={fields} values={{}} onSubmit={save} submitLabel="Create coupon" />
    </div>
  )
}

function BlogSection({ blogData, setBlogData }) {
  const [editing, setEditing] = useState(null)
  const [open, setOpen] = useState(false)
  const save = (form) => {
    if (editing) {
      setBlogData((prev) => prev.map((b) => (b.id === editing.id ? { ...b, ...form } : b)))
      toast.success('Post updated')
    } else {
      setBlogData((prev) => [{ ...form, id: uid('b'), readTime: 5, date: new Date().toISOString().slice(0, 10), excerpt: form.excerpt || form.title, tags: [], content: [{ type: 'p', text: 'Article body coming soon.' }] }, ...prev])
      toast.success('Post published')
    }
    setOpen(false)
  }
  const fields = [
    { key: 'title', label: 'Title', required: true, full: true },
    { key: 'category', label: 'Category', type: 'select', options: blogCategories },
    { key: 'author', label: 'Author', required: true },
    { key: 'image', label: 'Cover image URL', full: true },
    { key: 'excerpt', label: 'Excerpt', type: 'textarea', full: true },
  ]
  return (
    <div>
      <AdminTable
        title="Manage Blog" subtitle="Create and publish travel articles"
        columns={[
          { key: 'title', label: 'Article', render: (b) => <Thumb src={b.image} seed={`ab-${b.id}`} name={b.title} /> },
          { key: 'category', label: 'Category', render: (b) => <span className="chip bg-brand-500/10 text-brand-600 dark:text-brand-300">{b.category}</span> },
          { key: 'author', label: 'Author' },
          { key: 'date', label: 'Date', render: (b) => formatDate(b.date) },
          { key: 'readTime', label: 'Read', render: (b) => `${b.readTime} min` },
        ]}
        rows={blogData}
        searchKeys={['title', 'category', 'author']}
        onAdd={() => { setEditing(null); setOpen(true) }}
        onEdit={(row) => { setEditing(row); setOpen(true) }}
        onDelete={(row) => { setBlogData((prev) => prev.filter((b) => b.id !== row.id)); toast.success('Post deleted') }}
        addLabel="New post"
      />
      <EditorModal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit post' : 'New post'} fields={fields} values={editing || {}} onSubmit={save} submitLabel={editing ? 'Update post' : 'Publish post'} />
    </div>
  )
}

function SettingsSection({ hotelData, flightData, tourData, destData, allBookings, users, reviews }) {
  const [settings, setSettings] = useLocalStorage('wanderlust-admin-settings', {
    maintenance: false,
    autoApprove: true,
    reviewsModeration: false,
    showTestimonials: true,
    showBlog: true,
  })
  const toggles = [
    { key: 'maintenance', label: 'Maintenance mode', desc: 'Show a maintenance banner across the site' },
    { key: 'autoApprove', label: 'Auto-approve bookings', desc: 'Bookings are confirmed instantly without review' },
    { key: 'reviewsModeration', label: 'Moderate reviews', desc: 'Require admin approval before reviews go live' },
    { key: 'showTestimonials', label: 'Show testimonials', desc: 'Display customer testimonials on the homepage' },
    { key: 'showBlog', label: 'Show blog', desc: 'Enable the travel blog section' },
  ]
  const exportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      users: users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, provider: u.provider })),
      bookings: allBookings,
      reviews,
      hotels: hotelData,
      flights: flightData,
      tours: tourData,
      destinations: destData,
    }
    downloadJson(payload, 'wanderlust-export.json')
    toast.success('Database exported!')
  }
  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6">
        <h3 className="mb-4 font-display text-lg font-extrabold text-slate-900 dark:text-white">Site settings</h3>
        <div className="space-y-3">
          {toggles.map((t) => (
            <label key={t.key} className="flex cursor-pointer items-center justify-between rounded-2xl bg-white/60 dark:bg-slate-800/60 p-4">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{t.label}</p>
                <p className="text-xs text-slate-500">{t.desc}</p>
              </div>
              <button onClick={() => setSettings((s) => ({ ...s, [t.key]: !s[t.key] }))} className={cx('relative h-7 w-12 rounded-full transition-all', settings[t.key] ? 'bg-gradient-to-r from-brand-600 to-ocean-500' : 'bg-slate-300 dark:bg-slate-700')}>
                <span className={cx('absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all', settings[t.key] ? 'left-[22px]' : 'left-0.5')} />
              </button>
            </label>
          ))}
        </div>
      </div>
      <div className="glass rounded-3xl p-6">
        <h3 className="mb-2 font-display text-lg font-extrabold text-slate-900 dark:text-white">Data export</h3>
        <p className="text-sm text-slate-500">Export users, bookings, reviews and the catalog as JSON.</p>
        <button onClick={exportData} className="btn-primary mt-4 text-xs">
          <FaDownload /> Export database
        </button>
      </div>
      <div className="glass rounded-3xl border-l-4 border-l-brand-500 p-6">
        <p className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200"><FaCircleInfo className="text-brand-500" /> About this admin panel</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          This dashboard reads and writes the Express + MongoDB backend through <code className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-xs">http://localhost:5000/api</code> — hotels, flights, tours, destinations, bookings, users and reviews are persisted in MongoDB Atlas. Coupons and blog posts are stored locally in the browser (no backend model was requested for them).
        </p>
      </div>
    </div>
  )
}
