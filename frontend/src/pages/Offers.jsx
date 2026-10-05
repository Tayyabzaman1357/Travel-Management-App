import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FaTicket } from 'react-icons/fa6'
import OfferCard from '@/components/cards/OfferCard'
import Breadcrumb from '@/components/common/Breadcrumb'
import { offers } from '@/data/offers'
import { useSEO } from '@/utils/seo'
import { cx } from '@/utils/helpers'

const types = ['All', 'Coupon', 'Promo', 'Seasonal']

export default function Offers() {
  useSEO('Offers & Coupons — Wanderlust', 'Exclusive travel coupons, promo codes and seasonal discounts — updated daily.')
  const [type, setType] = useState('All')
  const [code, setCode] = useState('')
  const [claimed, setClaimed] = useState({})

  const filtered = offers.filter((o) => type === 'All' || o.type === type)

  const validate = () => {
    const c = offers.find((o) => o.code.toLowerCase() === code.trim().toLowerCase())
    if (!c) {
      toast.error('Invalid coupon code. Try SUMMER25 or WELCOME10.')
      return
    }
    toast.success(`${c.code} is valid — ${c.discount}% off ${c.category}! 🎉`)
    setClaimed((p) => ({ ...p, [c.id]: true }))
  }

  return (
    <div className="pt-28">
      <div className="relative overflow-hidden bg-gradient-to-br from-accent-600 via-brand-600 to-brand-500 pb-14">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="container-x relative">
          <div className="mb-6"><Breadcrumb items={[{ label: 'Offers & Coupons' }]} /></div>
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-5xl">Deals, Coupons & Promo Codes</h1>
          <p className="mt-3 max-w-xl text-sm text-white/85 sm:text-base">Seasonal discounts and exclusive codes — grab them before they expire.</p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-strong mt-8 flex max-w-md items-center gap-2 rounded-full p-2 pl-5">
            <FaTicket className="text-brand-500" />
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter coupon code…" className="w-full bg-transparent text-sm font-semibold uppercase tracking-widest outline-none" />
            <button onClick={validate} className="btn-primary !px-6 !py-2 text-xs">Apply</button>
          </motion.div>
        </div>
      </div>

      <div className="container-x py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          {types.map((t) => (
            <button key={t} onClick={() => setType(t)} className={cx('chip transition-all', type === t ? 'bg-gradient-to-r from-brand-600 to-ocean-500 text-white shadow-glow' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700')}>
              {t === 'All' ? 'All Deals' : t}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((o, i) => (
            <div key={o.id} className="relative">
              <OfferCard offer={o} index={i} />
              {claimed[o.id] && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-2 -top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-glow">
                  ✓
                </motion.span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-slate-400">
          New offers added every week — follow us on social media to never miss a deal.
        </p>
      </div>
    </div>
  )
}
