import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaShieldHalved, FaCheck, FaXmark, FaCrown } from 'react-icons/fa6'
import Breadcrumb from '@/components/common/Breadcrumb'
import { insurancePlans } from '@/data/insurance'
import { useApp } from '@/context/AppContext'
import { useSEO } from '@/utils/seo'
import { cx } from '@/utils/helpers'

export default function Insurance() {
  const { formatPrice } = useApp()
  useSEO('Travel Insurance — Wanderlust', 'Compare essential, premium and elite travel insurance plans with 24/7 assistance.')
  const [selectedPlan, setSelectedPlan] = useState('ins2')

  return (
    <div className="pt-28">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-ocean-500 pb-16">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="container-x relative">
          <div className="mb-6"><Breadcrumb items={[{ label: 'Travel Insurance' }]} /></div>
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-5xl">Travel with Total Peace of Mind</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base">
            Medical coverage, trip cancellation, baggage protection and 24/7 global assistance — starting from {formatPrice(29)} per trip.
          </p>
        </div>
      </div>

      <div className="container-x -mt-8 pb-16">
        {/* Plans */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {insurancePlans.map((plan, i) => {
            const active = selectedPlan === plan.id
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelectedPlan(plan.id)}
                className={cx(
                  'relative flex cursor-pointer flex-col rounded-3xl border-2 p-6 transition-all duration-300 hover:-translate-y-1.5',
                  active ? 'border-brand-500 bg-white dark:bg-slate-900 shadow-glow' : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 hover:border-brand-300'
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-to-r from-brand-600 to-ocean-500 px-4 py-1 text-[10px] font-extrabold text-white shadow-glow">
                    <FaCrown /> MOST POPULAR
                  </span>
                )}
                <p className="font-display text-lg font-extrabold text-slate-900 dark:text-white">{plan.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{plan.tagline}</p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="font-display text-4xl font-extrabold text-slate-900 dark:text-white">{formatPrice(plan.price)}</span>
                  <span className="pb-1 text-xs font-semibold text-slate-400">{plan.perTrip ? '/trip' : '/year'}</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">Up to {plan.coverage.toLocaleString()} coverage</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f.label} className="flex items-start gap-2 text-xs">
                      {f.included ? <FaCheck className="mt-0.5 shrink-0 text-emerald-500" /> : <FaXmark className="mt-0.5 shrink-0 text-slate-300 dark:text-slate-600" />}
                      <span className={f.included ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 line-through'}>{f.label}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={cx('mt-6 w-full rounded-full py-3 text-xs font-bold transition-all', active ? 'bg-gradient-to-r from-brand-600 to-ocean-500 text-white shadow-glow' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300')}
                >
                  {active ? 'Selected' : 'Choose plan'}
                </button>
              </motion.div>
            )
          })}
        </div>

        {/* Purchase CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl p-8 sm:flex-row">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-ocean-500 text-2xl text-white"><FaShieldHalved /></span>
            <div>
              <p className="font-display text-lg font-extrabold text-slate-900 dark:text-white">
                {insurancePlans.find((p) => p.id === selectedPlan)?.name} plan selected
              </p>
              <p className="text-sm text-slate-500">Coverage of up to {insurancePlans.find((p) => p.id === selectedPlan)?.coverage.toLocaleString()} for your upcoming trip.</p>
            </div>
          </div>
          <Link to={`/booking?type=insurance&id=${selectedPlan}`} className="btn-primary !px-10">
            Buy Insurance
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
