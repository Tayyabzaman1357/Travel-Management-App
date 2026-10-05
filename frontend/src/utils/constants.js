// Global constants used across the app

export const SITE_NAME = 'Wanderlust'
export const SITE_TAGLINE = 'Travel beyond the horizon'

export const DEFAULT_CURRENCY = 'USD'

export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar', rate: 1 },
  { code: 'EUR', symbol: '€', label: 'Euro', rate: 0.92 },
  { code: 'GBP', symbol: '£', label: 'British Pound', rate: 0.79 },
  { code: 'PKR', symbol: '₨', label: 'Pakistani Rupee', rate: 278.5 },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham', rate: 3.67 },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee', rate: 84.1 },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen', rate: 152.4 },
  { code: 'SAR', symbol: '﷼', label: 'Saudi Riyal', rate: 3.75 },
]

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'ur', label: 'Urdu', native: 'اردو' },
]

export const THEMES = { LIGHT: 'light', DARK: 'dark' }

export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
}

export const USER_ROLES = { USER: 'user', ADMIN: 'admin' }

// Demo accounts (active in demo mode)
export const DEMO_ACCOUNTS = [
  { email: 'admin@wanderlust.com', password: 'admin123', name: 'Alex Morgan', role: USER_ROLES.ADMIN },
  { email: 'user@wanderlust.com', password: 'user123', name: 'Sarah Khan', role: USER_ROLES.USER },
]

export const NAV_LINKS = [
  { label: 'Flights', path: '/flights' },
  { label: 'Hotels', path: '/hotels' },
  { label: 'Destinations', path: '/destinations' },
  { label: 'Tours', path: '/tours' },
  { label: 'Cars', path: '/cars' },
  { label: 'Cruises', path: '/cruises' },
]

export const MORE_LINKS = [
  { label: 'Visa Assistance', path: '/visa' },
  { label: 'Travel Insurance', path: '/insurance' },
  { label: 'Offers & Coupons', path: '/offers' },
  { label: 'Blog & Guides', path: '/blog' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Testimonials', path: '/testimonials' },
]

export const TRAVEL_CATEGORIES = [
  { id: 'beach', label: 'Beach Escapes' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'city', label: 'City Breaks' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'family', label: 'Family' },
  { id: 'culture', label: 'Culture' },
  { id: 'nature', label: 'Nature' },
  { id: 'cruise', label: 'Cruises' },
]

export const POPULAR_CITIES = ['Paris', 'Dubai', 'Tokyo', 'New York', 'Bali', 'Rome', 'London', 'Sydney']

export const PAGE_SIZE = 9

export const RECENTLY_VIEWED_KEY = 'wanderlust-recently-viewed'
export const WISHLIST_KEY = 'wanderlust-wishlist'
export const DB_KEY = 'wanderlust-demo-db'
export const SESSION_KEY = 'wanderlust-session'
export const THEME_KEY = 'travel-theme'
export const CURRENCY_KEY = 'wanderlust-currency'
export const LANG_KEY = 'wanderlust-lang'
