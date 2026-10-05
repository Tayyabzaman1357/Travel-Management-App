import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaPlaneDeparture, FaMagnifyingGlass, FaMoon, FaSun, FaBars, FaXmark, FaChevronDown,
  FaHeart, FaRightFromBracket, FaGaugeHigh, FaChevronRight,
} from 'react-icons/fa6'
import { NAV_LINKS, MORE_LINKS } from '@/utils/constants'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { useWishlist } from '@/context/WishlistContext'
import { useApp } from '@/context/AppContext'
import NotificationBell from '@/components/common/NotificationBell'
import SearchModal from './SearchModal'
import { cx } from '@/utils/helpers'
import { initials } from '@/utils/format'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, signOut, isAdmin } = useAuth()
  const { count: wishlistCount } = useWishlist()
  const { currency, changeCurrency, currencies, lang, changeLang, languages, t } = useApp()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setMoreOpen(false)
    setUserOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    setUserOpen(false)
    await signOut()
    navigate('/')
  }

return (
    <>
      <header
        className={cx(
          'fixed inset-x-0 top-0 z-[90] transition-all duration-500',
          scrolled ? 'glass-strong py-2 shadow-soft-lg' : 'bg-transparent py-3'
        )}
      >
        <div className="container-x flex items-center justify-between gap-3">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-ocean-500 text-base text-white shadow-glow transition-transform duration-300 group-hover:rotate-12">
              <FaPlaneDeparture />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              Wander<span className="text-gradient">lust</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            <NavItem to="/" label={t('home')} />
            {NAV_LINKS.map((l) => (
              <NavItem key={l.path} to={l.path} label={t(l.label.toLowerCase())} />
            ))}
            <div className="relative">
              <button
                onClick={() => setMoreOpen((o) => !o)}
                className={cx(
                  'flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-300',
                  moreOpen ? 'text-brand-600 dark:text-brand-300 bg-brand-500/10' : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10'
                )}
              >
                {t('more')} <FaChevronDown className={cx('text-[10px] transition-transform', moreOpen && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="glass-strong absolute right-0 top-12 z-50 w-72 rounded-3xl p-3"
                  >
                    <div className="grid grid-cols-2 gap-1">
                      {MORE_LINKS.map((l) => (
                        <Link
                          key={l.path}
                          to={l.path}
                          className="block rounded-2xl px-3 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-all hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-300"
                        >
                          {l.label}
                        </Link>
                      ))}
                    </div>
                    <Link to="/offers" className="mt-2 flex items-center justify-between rounded-2xl bg-gradient-to-r from-brand-600 to-ocean-500 px-4 py-3 text-xs font-bold text-white shadow-glow transition-transform hover:scale-[1.02]">
                      {t('deals')} <FaChevronRight className="text-[10px]" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden h-9 w-9 items-center justify-center rounded-full bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200 backdrop-blur transition-all hover:scale-105 hover:text-brand-600 sm:flex"
              aria-label="Search"
            >
              <FaMagnifyingGlass />
            </button>

            {/* Currency */}
            <div className="relative hidden md:block">
              <select
                value={currency.code}
                onChange={(e) => changeCurrency(e.target.value)}
                className="cursor-pointer appearance-none rounded-full border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-200 backdrop-blur outline-none transition-all hover:border-brand-400"
                aria-label="Currency"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div className="relative hidden md:block">
              <select
                value={lang}
                onChange={(e) => changeLang(e.target.value)}
                className="cursor-pointer appearance-none rounded-full border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-200 backdrop-blur outline-none transition-all hover:border-brand-400"
                aria-label="Language"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>{l.native}</option>
                ))}
              </select>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200 backdrop-blur transition-all hover:rotate-12 hover:scale-105 hover:text-amber-500"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? <FaSun /> : <FaMoon />}
                </motion.span>
              </AnimatePresence>
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative hidden h-9 w-9 items-center justify-center rounded-full bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200 backdrop-blur transition-all hover:scale-105 hover:text-accent-500 sm:flex"
              aria-label="Wishlist"
            >
              <FaHeart />
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-extrabold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <NotificationBell />
                <div className="relative">
                  <button
                    onClick={() => setUserOpen((o) => !o)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-ocean-500 text-xs font-extrabold text-white ring-2 ring-white dark:ring-slate-800 shadow-glow transition-transform hover:scale-105"
                    aria-label="Account"
                  >
                    {user.photoURL ? <img src={user.photoURL} alt="" className="h-full w-full rounded-full object-cover" /> : initials(user.name)}
                  </button>
                  <AnimatePresence>
                    {userOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.96 }}
                        className="glass-strong absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl p-2"
                      >
                        <div className="border-b border-slate-100 dark:border-slate-800 px-3 py-3">
                          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                        </div>
                        <div className="pt-1">
                          <MenuLink to="/dashboard" icon={<FaGaugeHigh />} label={t('dashboard')} onClick={() => setUserOpen(false)} />
                          <MenuLink to="/wishlist" icon={<FaHeart />} label={t('wishlist')} onClick={() => setUserOpen(false)} />
                          {isAdmin && <MenuLink to="/admin" icon={<FaGaugeHigh />} label={t('admin')} onClick={() => setUserOpen(false)} />}
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-accent-600 dark:text-accent-400 transition-colors hover:bg-accent-500/10"
                          >
                            <FaRightFromBracket /> {t('logout')}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Link to="/login" className="btn-primary hidden !px-4 !py-1.5 text-xs sm:inline-flex">
                {t('signIn')}
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200 backdrop-blur lg:hidden"
              aria-label="Open menu"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[95] bg-slate-950/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-[96] flex w-80 max-w-[85vw] flex-col bg-white dark:bg-slate-900 shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 py-4">
                <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold text-slate-900 dark:text-white">
                  <FaPlaneDeparture className="text-brand-500" /> Wander<span className="text-gradient">lust</span>
                </Link>
                <button onClick={() => setMobileOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500" aria-label="Close">
                  <FaXmark />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-3 py-4">
                <MobileLink to="/" label={t('home')} />
                {NAV_LINKS.map((l) => (
                  <MobileLink key={l.path} to={l.path} label={t(l.label.toLowerCase())} />
                ))}
                <p className="mb-1 mt-4 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">{t('more')}</p>
                {MORE_LINKS.map((l) => (
                  <MobileLink key={l.path} to={l.path} label={l.label} small />
                ))}
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-brand-500/10"
                >
                  <FaMagnifyingGlass className="text-brand-500" /> {t('search')}
                </button>
              </nav>
              <div className="border-t border-slate-100 dark:border-slate-800 p-4">
                {user ? (
                  <button onClick={handleLogout} className="btn-outline w-full text-xs">
                    <FaRightFromBracket /> {t('logout')} · {user.name.split(' ')[0]}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" className="btn-outline flex-1 text-xs">{t('signIn')}</Link>
                    <Link to="/signup" className="btn-primary flex-1 text-xs">{t('signUp')}</Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        cx(
          'rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-300',
          isActive ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300' : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10'
        )
      }
    >
      {label}
    </NavLink>
  )
}

function MenuLink({ to, icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 transition-colors hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-300"
    >
      <span className="text-brand-500">{icon}</span> {label}
    </Link>
  )
}

function MobileLink({ to, label, small }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        cx(
          'flex items-center justify-between rounded-xl px-3 transition-colors',
          small ? 'py-2 text-[13px] font-medium' : 'py-3 text-sm font-bold',
          isActive ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
        )
      }
    >
      {label}
      <FaChevronRight className="text-[10px] text-slate-300" />
    </NavLink>
  )
}
