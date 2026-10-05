// Formatting helpers: currency, dates, durations, numbers

export function formatCurrency(amount, currency = 'USD', symbol = null) {
  const cur = symbol || currencySymbol(currency)
  const value = Number(amount || 0)
  const formatted = value.toLocaleString('en-US', { maximumFractionDigits: value % 1 === 0 ? 0 : 2 })
  return `${cur}${formatted}`
}

export function currencySymbol(code) {
  const map = {
    USD: '$', EUR: '€', GBP: '£', PKR: '₨', AED: 'د.إ', INR: '₹', JPY: '¥', SAR: '﷼',
  }
  return map[code] || '$'
}

export function convertPrice(amount, from = 1, rate = 1) {
  return Number(((amount / from) * rate).toFixed(2))
}

export function formatDate(dateStr, opts = {}) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', ...opts })
}

export function formatTime(timeStr) {
  if (!timeStr) return '—'
  const [h, m] = timeStr.split(':')
  const hour = parseInt(h, 10)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 === 0 ? 12 : hour % 12
  return `${h12}:${m} ${suffix}`
}

export function formatDuration(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function daysBetween(start, end) {
  if (!start || !end) return 1
  const s = new Date(start)
  const e = new Date(end)
  const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24))
  return Math.max(diff, 1)
}

export function nightsBetween(start, end) {
  return daysBetween(start, end)
}

export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

export function truncate(str, len = 100) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len).trim() + '…' : str
}

export function initials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function pluralize(count, singular, plural = null) {
  return `${count} ${count === 1 ? singular : plural || singular + 's'}`
}

export function ratingLabel(rating) {
  if (rating >= 4.7) return 'Exceptional'
  if (rating >= 4.3) return 'Excellent'
  if (rating >= 3.8) return 'Very Good'
  if (rating >= 3.2) return 'Good'
  return 'Average'
}

export function nextDays(n = 30) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export function addDays(dateStr, n) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export function parseQuery(qs) {
  return Object.fromEntries(new URLSearchParams(qs))
}

export function toQuery(params) {
  const sp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') sp.set(k, v)
  })
  const s = sp.toString()
  return s ? `?${s}` : ''
}
