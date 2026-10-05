import api, { listWithId, withId } from './api'
import { uid } from '@/utils/helpers'

// ── Bookings (backend) ──────────────────────────────────────────────────────

export const bookingService = {
  async create(data) {
    const { data: res } = await api.post('/bookings', data)
    return withId(res.data)
  },
  async getMyBookings() {
    const { data } = await api.get('/bookings/my')
    return listWithId(data.data)
  },
  async getAllBookings() {
    const { data } = await api.get('/bookings')
    return listWithId(data.data)
  },
  async getBooking(id) {
    const { data } = await api.get(`/bookings/${id}`)
    return withId(data.data)
  },
  async updateStatus(id, status) {
    const { data } = await api.put(`/bookings/${id}`, { status })
    return withId(data.data)
  },
  async updateBooking(id, patch) {
    const { data } = await api.put(`/bookings/${id}`, patch)
    return withId(data.data)
  },
  async deleteBooking(id) {
    await api.delete(`/bookings/${id}`)
    return true
  },
}

// ── Notifications (local — no backend model requested) ─────────────────────

const NOTIF_KEY = 'wanderlust-notifications'

const readNotifs = () => {
  try {
    return JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]')
  } catch {
    return []
  }
}
const writeNotifs = (items) => localStorage.setItem(NOTIF_KEY, JSON.stringify(items))

export const notificationService = {
  async getMine(userId) {
    return readNotifs().filter((n) => n.userId === userId)
  },
  async markRead(id) {
    writeNotifs(readNotifs().map((n) => (n.id === id ? { ...n, read: true } : n)))
    return true
  },
  async markAllRead(userId) {
    writeNotifs(readNotifs().map((n) => (n.userId === userId ? { ...n, read: true } : n)))
    return true
  },
  async push(userId, notification) {
    const n = { ...notification, id: uid('n'), userId, read: false, date: new Date().toISOString() }
    writeNotifs([n, ...readNotifs()])
    return n
  },
  async remove(id) {
    writeNotifs(readNotifs().filter((n) => n.id !== id))
    return true
  },
}

// ── Coupons (local — no backend model requested) ───────────────────────────

const COUPON_KEY = 'wanderlust-coupons'

const readCoupons = () => {
  try {
    return JSON.parse(localStorage.getItem(COUPON_KEY) || '[]')
  } catch {
    return []
  }
}
const writeCoupons = (items) => localStorage.setItem(COUPON_KEY, JSON.stringify(items))

export const couponService = {
  async getAll() {
    return readCoupons()
  },
  async add(coupon) {
    const c = { ...coupon, id: uid('cp'), createdAt: new Date().toISOString() }
    writeCoupons([c, ...readCoupons()])
    return c
  },
  async update(id, patch) {
    const items = readCoupons().map((c) => (c.id === id ? { ...c, ...patch } : c))
    writeCoupons(items)
    return items.find((c) => c.id === id)
  },
  async remove(id) {
    writeCoupons(readCoupons().filter((c) => c.id !== id))
    return true
  },
  async validate(code) {
    const c = readCoupons().find((x) => x.code.toLowerCase() === String(code || '').toLowerCase())
    if (!c) return { valid: false, message: 'Invalid coupon code.' }
    if (c.expiry && new Date(c.expiry) < new Date()) return { valid: false, message: 'This coupon has expired.' }
    return { valid: true, coupon: c }
  },
}
