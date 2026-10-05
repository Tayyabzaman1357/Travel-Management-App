import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  FaGaugeHigh, FaPlane, FaBed, FaCompass, FaCar, FaShip, FaTicket, FaHeart, FaBell,
  FaStar, FaUser, FaGear, FaRightFromBracket, FaCircleCheck, FaCircleXmark, FaClock,
  FaDownload, FaTrashCan, FaPaperPlane,
} from 'react-icons/fa6'
import Sidebar from '@/components/layout/Sidebar'
import Img from '@/components/common/Img'
import Rating from '@/components/common/Rating'
import EmptyState from '@/components/common/EmptyState'
import { useAuth } from '@/context/AuthContext'
import { useBookings } from '@/context/BookingContext'
import { useWishlist } from '@/context/WishlistContext'
import { useNotifications } from '@/context/NotificationContext'
import { reviewService } from '@/services/reviewService'
import { useApp } from '@/context/AppContext'
import { useSEO } from '@/utils/seo'
import { formatDate, timeAgo, initials } from '@/utils/format'
import { BOOKING_STATUS } from '@/utils/constants'
import { cx, downloadJson } from '@/utils/helpers'

const typeIcons = { flight: <FaPlane />, hotel: <FaBed />, tour: <FaCompass />, car: <FaCar />, cruise: <FaShip />, insurance: <FaTicket /> }
const statusMeta = {
  confirmed: { label: 'Confirmed', cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  pending: { label: 'Pending', cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  cancelled: { label: 'Cancelled', cls: 'bg-accent-500/10 text-accent-600 dark:text-accent-400' },
  completed: { label: 'Completed', cls: 'bg-slate-500/10 text-slate-500 dark:text-slate-400' },
}

export default function UserDashboard() {
  useSEO('My Dashboard — Wanderlust', 'Manage your bookings, wishlist, reviews and profile.')
  const { user, signOut, updateProfile, isAdmin } = useAuth()
  const { bookings, cancelBooking, deleteBooking, loading } = useBookings()
  const { wishlist, removeItem, clearAll } = useWishlist()
  const { notifications, unreadCount, markAllRead, markRead, remove: removeNotif } = useNotifications()
  const { formatPrice, currency, changeCurrency, currencies, lang, changeLang, languages } = useApp()
  const [section, setSection] = useState('overview')
  const [myReviews, setMyReviews] = useState([])
  const [bookingsLoaded, setBookingsLoaded] = useState(false)

  useEffect(() => {
    reviewService.getMine().then(setMyReviews).catch(() => {})
    const t = setTimeout(() => setBookingsLoaded(true), 400)
    return () => clearTimeout(t)
  }, [user?.id])

  const items = useMemo(() => [
    { key: 'overview', label: 'Overview', icon: <FaGaugeHigh /> },
    { key: 'bookings', label: 'My Bookings', icon: <FaPlane />, badge: bookings.length },
    { key: 'wishlist', label: 'Wishlist', icon: <FaHeart />, badge: wishlist.length },
    { key: 'notifications', label: 'Notifications', icon: <FaBell />, badge: unreadCount },
    { key: 'reviews', label: 'My Reviews', icon: <FaStar />, badge: myReviews.length },
    { key: 'profile', label: 'Profile', icon: <FaUser /> },
    { key: 'settings', label: 'Settings', icon: <FaGear /> },
  ], [bookings.length, wishlist.length, unreadCount, myReviews.length])

  const stats = useMemo(() => {
    const upcoming = bookings.filter((b) => b.status === 'confirmed' && new Date(b.date) >= new Date()).length
    const completed = bookings.filter((b) => b.status === 'completed').length
    const spent = bookings.filter((b) => b.status !== 'cancelled').reduce((a, b) => a + (b.total || 0), 0)
    return { upcoming, completed, spent, total: bookings.length }
  }, [bookings])

  const logout = async () => {
    await signOut()
    toast.success('Signed out. See you soon! 👋')
  }

  return (
    <div className="container-x pt-28 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-ocean-500 font-display text-lg font-extrabold text-white shadow-glow">
            {user?.photoURL ? <img src={user.photoURL} alt="" className="h-full w-full rounded-2xl object-cover" /> : initials(user?.name || 'U')}
          </span>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Hi, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="btn-outline text-xs"><FaRightFromBracket /> Sign out</button>
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <Sidebar items={items} activeKey={section} onChange={setSection} title="My Account" />

        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
              {section === 'overview' && (
                <Overview user={user} stats={stats} bookings={bookings} formatPrice={formatPrice} onGoBookings={() => setSection('bookings')} />
              )}
              {section === 'bookings' && (
                <BookingsSection bookings={bookings} loading={loading || !bookingsLoaded} formatPrice={formatPrice} cancelBooking={cancelBooking} deleteBooking={deleteBooking} />
              )}
              {section === 'wishlist' && (
                <WishlistSection wishlist={wishlist} removeItem={removeItem} clearAll={clearAll} formatPrice={formatPrice} />
              )}
              {section === 'notifications' && (
                <NotificationsSection notifications={notifications} unreadCount={unreadCount} markAllRead={markAllRead} markRead={markRead} remove={removeNotif} />
              )}
              {section === 'reviews' && <ReviewsSection reviews={myReviews} setReviews={setMyReviews} formatPrice={formatPrice} />}
              {section === 'profile' && <ProfileSection user={user} updateProfile={updateProfile} />}
              {section === 'settings' && (
                <SettingsSection currency={currency} changeCurrency={changeCurrency} currencies={currencies} lang={lang} changeLang={changeLang} languages={languages} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ── Sections ─────────────────────────────────────────────────────────────── */

function Overview({ user, stats, bookings, formatPrice, onGoBookings }) {
  const upcoming = bookings.filter((b) => b.status === 'confirmed' && new Date(b.date) >= new Date()).slice(0, 3)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total bookings', value: stats.total, icon: <FaPlane /> },
          { label: 'Upcoming trips', value: stats.upcoming, icon: <FaClock /> },
          { label: 'Completed', value: stats.completed, icon: <FaCircleCheck /> },
          { label: 'Total spent', value: formatPrice(stats.spent), icon: <FaTicket /> },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass rounded-3xl p-5 card-hover">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/15 to-ocean-500/15 text-lg text-brand-500">{s.icon}</span>
            <p className="mt-3 font-display text-2xl font-extrabold text-slate-900 dark:text-white">{s.value}</p>
            <p className="text-xs font-semibold text-slate-500">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-3xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">Upcoming trips</h3>
          <button onClick={onGoBookings} className="text-xs font-bold text-brand-600 hover:underline">View all</button>
        </div>
        {upcoming.length === 0 ? (
          <EmptyState icon={<FaPlane />} title="No upcoming trips" text="Book your next adventure and it will appear here." action={<Link to="/destinations" className="btn-primary text-xs">Explore destinations</Link>} />
        ) : (
          <div className="space-y-3">
            {upcoming.map((b) => (
              <div key={b.id} className="flex items-center gap-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 p-3">
                <Img src={b.image} seed={`ov-${b.id}`} alt="" className="h-14 w-14 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{b.itemName}</p>
                  <p className="text-xs text-slate-500">{formatDate(b.date)}{b.endDate ? ` – ${formatDate(b.endDate)}` : ''}</p>
                </div>
                <span className={cx('chip', statusMeta[b.status]?.cls)}>{statusMeta[b.status]?.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass rounded-3xl bg-gradient-to-br from-brand-600 to-ocean-500 p-6 text-white">
        <h3 className="font-display text-lg font-extrabold">Travel smarter 🧳</h3>
        <p className="mt-1 text-sm text-white/85">Complete your profile to unlock member-only deals and earn 2x points on your next booking.</p>
        <Link to="/offers" className="mt-4 inline-flex rounded-full bg-white px-6 py-2.5 text-xs font-extrabold text-brand-600 transition-transform hover:scale-105">View exclusive offers</Link>
      </div>
    </div>
  )
}

function BookingsSection({ bookings, loading, formatPrice, cancelBooking, deleteBooking }) {
  const [filter, setFilter] = useState('all')
  const filtered = bookings.filter((b) => filter === 'all' || b.status === filter)
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cx('chip capitalize transition-all', filter === f ? 'bg-gradient-to-r from-brand-600 to-ocean-500 text-white shadow-glow' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700')}>
            {f}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-28 w-full rounded-3xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<FaPlane />} title="No bookings here" text="When you book flights, hotels or tours, they'll show up in this list." action={<Link to="/flights" className="btn-primary text-xs">Search flights</Link>} />
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div key={b.id} className="glass rounded-3xl p-5">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 text-xl text-brand-500">{typeIcons[b.type] || <FaTicket />}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-extrabold text-slate-900 dark:text-white">{b.itemName}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{formatDate(b.date)}{b.endDate ? ` – ${formatDate(b.endDate)}` : ''} · {b.guests} traveler{b.guests > 1 ? 's' : ''}</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-slate-400">Ref: {b.reference} · {b.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-extrabold text-slate-900 dark:text-white">{formatPrice(b.total)}</p>
                  <span className={cx('chip mt-1', statusMeta[b.status]?.cls)}>{statusMeta[b.status]?.label}</span>
                </div>
              </div>
              {b.seats?.length > 0 && <p className="mt-3 text-xs font-semibold text-slate-500">Seats: <span className="font-bold text-brand-600">{b.seats.join(', ')}</span></p>}
              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                <button onClick={() => { downloadJson(b, `${b.reference}.json`); toast.success('E-ticket downloaded!') }} className="btn-outline !px-4 !py-2 text-[11px]"><FaDownload /> E-ticket</button>
                {(b.status === 'confirmed' || b.status === 'pending') && (
                  <button onClick={() => cancelBooking(b.id)} className="rounded-full border-2 border-accent-500/40 px-4 py-2 text-[11px] font-bold text-accent-500 transition-all hover:bg-accent-500 hover:text-white"><FaCircleXmark /> Cancel</button>
                )}
                <button onClick={() => deleteBooking(b.id)} className="rounded-full px-4 py-2 text-[11px] font-bold text-slate-400 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-accent-500"><FaTrashCan /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function WishlistSection({ wishlist, removeItem, clearAll, formatPrice }) {
  if (wishlist.length === 0) {
    return <EmptyState icon={<FaHeart />} title="Your wishlist is empty" text="Save hotels, flights and destinations to plan your next trip." action={<Link to="/destinations" className="btn-primary text-xs">Explore destinations</Link>} />
  }
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">{wishlist.length} saved items</p>
        <button onClick={clearAll} className="text-xs font-bold text-accent-500 hover:underline"><FaTrashCan /> Clear all</button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {wishlist.map((w) => (
          <div key={`${w.type}-${w.id}`} className="glass flex gap-4 rounded-3xl p-4 card-hover">
            <Img src={w.item.image} seed={`dw-${w.type}-${w.id}`} alt={w.item.name} className="h-20 w-24 shrink-0 rounded-2xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{w.item.name}</p>
              <p className="text-xs capitalize text-slate-500">{w.type}{w.item.city ? ` · ${w.item.city}` : ''}</p>
              {w.item.rating && <Rating value={w.item.rating} size="xs" className="mt-1" />}
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-extrabold text-brand-600 dark:text-brand-300">{formatPrice(w.type === 'car' ? w.item.pricePerDay : w.item.price ?? 0)}</span>
                <button onClick={() => removeItem(w.type, w.id)} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 transition-all hover:bg-accent-500 hover:text-white"><FaTrashCan className="text-xs" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NotificationsSection({ notifications, unreadCount, markAllRead, markRead, remove }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">{unreadCount} unread</p>
        {unreadCount > 0 && <button onClick={markAllRead} className="text-xs font-bold text-brand-600 hover:underline">Mark all read</button>}
      </div>
      {notifications.length === 0 ? (
        <EmptyState icon={<FaBell />} title="No notifications" text="Booking updates and offers will appear here." />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} onClick={() => markRead(n.id)} className={cx('glass flex cursor-pointer gap-4 rounded-3xl p-4 transition-all hover:shadow-soft', !n.read && 'border-l-4 border-l-brand-500')}>
              <span className="text-2xl">{n.type === 'booking' ? '🎉' : n.type === 'offer' ? '🏷️' : '✈️'}</span>
              <div className="min-w-0 flex-1">
                <p className={cx('text-sm font-bold', n.read ? 'text-slate-600 dark:text-slate-300' : 'text-slate-900 dark:text-white')}>{n.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{n.message}</p>
                <p className="mt-1 text-[10px] text-slate-400">{timeAgo(n.date)}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); remove(n.id) }} className="self-start text-slate-300 hover:text-accent-500" aria-label="Dismiss"><FaTrashCan /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ReviewsSection({ reviews, setReviews, formatPrice }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const onSubmit = async (data) => {
    const r = await reviewService.add({ ...data, rating: Number(data.rating), userName: 'You' })
    setReviews((prev) => [r, ...prev])
    reset()
    toast.success('Review submitted — thank you!')
  }
  return (
    <div>
      <div className="glass mb-6 rounded-3xl p-6">
        <h3 className="mb-4 font-display text-lg font-extrabold text-slate-900 dark:text-white">Write a review</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">Booking / item</label>
              <input {...register('title', { required: 'Title is required' })} placeholder="e.g. Aurora Grand Palace" className="input-base" />
              {errors.title && <p className="mt-1 text-xs text-accent-500">{errors.title.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">Rating</label>
              <select {...register('rating', { required: true })} className="input-base">
                <option value="5">★★★★★ 5 — Exceptional</option>
                <option value="4">★★★★ 4 — Excellent</option>
                <option value="3">★★★ 3 — Good</option>
                <option value="2">★★ 2 — Fair</option>
                <option value="1">★ 1 — Poor</option>
              </select>
            </div>
          </div>
          <textarea {...register('text', { required: 'Review text is required', minLength: { value: 10, message: 'Write at least 10 characters' } })} rows={3} placeholder="Share your experience…" className="input-base resize-none" />
          {errors.text && <p className="text-xs text-accent-500">{errors.text.message}</p>}
          <button type="submit" className="btn-primary text-xs"><FaPaperPlane /> Submit review</button>
        </form>
      </div>
      {reviews.length === 0 ? (
        <EmptyState icon={<FaStar />} title="No reviews yet" text="Share your travel experience after your next trip." />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="glass rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <Rating value={r.rating} showLabel />
                <button onClick={async () => { await reviewService.remove(r.id); setReviews((prev) => prev.filter((x) => x.id !== r.id)); toast.success('Review deleted') }} className="text-slate-300 hover:text-accent-500"><FaTrashCan /></button>
              </div>
              <p className="mt-2 font-display text-sm font-extrabold text-slate-900 dark:text-white">{r.title}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{r.text}</p>
              <p className="mt-2 text-[11px] text-slate-400">{timeAgo(r.createdAt || r.date)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ProfileSection({ user, updateProfile }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { name: user?.name, phone: user?.phone, address: user?.address } })
  const onSubmit = async (data) => {
    await updateProfile(data)
    toast.success('Profile updated! ✅')
  }
  return (
    <div className="glass rounded-3xl p-6">
      <h3 className="mb-6 font-display text-lg font-extrabold text-slate-900 dark:text-white">Profile information</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-ocean-500 font-display text-lg font-extrabold text-white">
            {user?.photoURL ? <img src={user.photoURL} alt="" className="h-full w-full rounded-2xl object-cover" /> : initials(user?.name || 'U')}
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <p className="mt-1 text-[11px] capitalize text-slate-400">{user?.provider} account · {user?.role}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500">Full name</label>
            <input {...register('name', { required: 'Name is required' })} className="input-base" />
            {errors.name && <p className="mt-1 text-xs text-accent-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500">Email (read-only)</label>
            <input value={user?.email} disabled className="input-base opacity-60" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500">Phone</label>
            <input {...register('phone')} placeholder="+1 555 000 0000" className="input-base" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500">Address</label>
            <input {...register('address')} placeholder="City, Country" className="input-base" />
          </div>
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-primary text-xs">{isSubmitting ? 'Saving…' : 'Save changes'}</button>
      </form>
    </div>
  )
}

function SettingsSection({ currency, changeCurrency, currencies, lang, changeLang, languages }) {
  const [prefs, setPrefs] = useState({ emailOffers: true, emailAlerts: true, twoFactor: false })
  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6">
        <h3 className="mb-4 font-display text-lg font-extrabold text-slate-900 dark:text-white">Preferences</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500">Display currency</label>
            <select value={currency.code} onChange={(e) => changeCurrency(e.target.value)} className="input-base">
              {currencies.map((c) => <option key={c.code} value={c.code}>{c.label} ({c.code})</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500">Language</label>
            <select value={lang} onChange={(e) => changeLang(e.target.value)} className="input-base">
              {languages.map((l) => <option key={l.code} value={l.code}>{l.native} ({l.label})</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="glass rounded-3xl p-6">
        <h3 className="mb-4 font-display text-lg font-extrabold text-slate-900 dark:text-white">Notifications</h3>
        <div className="space-y-3">
          {[
            { key: 'emailOffers', label: 'Deals & offers emails', desc: 'Weekly exclusive promotions' },
            { key: 'emailAlerts', label: 'Price drop alerts', desc: 'Notify me when prices change' },
            { key: 'twoFactor', label: 'Two-factor authentication', desc: 'Extra security for your account' },
          ].map((t) => (
            <label key={t.key} className="flex cursor-pointer items-center justify-between rounded-2xl bg-white/60 dark:bg-slate-800/60 p-4">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{t.label}</p>
                <p className="text-xs text-slate-500">{t.desc}</p>
              </div>
              <button onClick={() => setPrefs((p) => ({ ...p, [t.key]: !p[t.key] }))} className={cx('relative h-7 w-12 rounded-full transition-all', prefs[t.key] ? 'bg-gradient-to-r from-brand-600 to-ocean-500' : 'bg-slate-300 dark:bg-slate-700')}>
                <span className={cx('absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all', prefs[t.key] ? 'left-[22px]' : 'left-0.5')} />
              </button>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
