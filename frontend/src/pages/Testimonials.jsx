import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaStar } from 'react-icons/fa6'
import TestimonialCard from '@/components/cards/TestimonialCard'
import Breadcrumb from '@/components/common/Breadcrumb'
import Pagination from '@/components/common/Pagination'
import { testimonials } from '@/data/testimonials'
import { useSEO } from '@/utils/seo'
import { cx } from '@/utils/helpers'

const PAGE_SIZE = 9

export default function Testimonials() {
  useSEO('Testimonials — Wanderlust', 'Real reviews from 48,000+ verified travelers who booked with Wanderlust.')
  const [rating, setRating] = useState(0)
  const [page, setPage] = useState(1)

  const avg = testimonials.reduce((a, t) => a + t.rating, 0) / testimonials.length
  const filtered = rating ? testimonials.filter((t) => t.rating >= rating) : testimonials
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="pt-28">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-ocean-500 pb-16">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="container-x relative">
          <div className="mb-6"><Breadcrumb items={[{ label: 'Testimonials' }]} /></div>
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-5xl">Trusted by travelers worldwide</h1>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="font-display text-6xl font-extrabold text-white">{avg.toFixed(1)}</span>
              <div>
                <div className="flex gap-1 text-xl text-amber-300">
                  {[1, 2, 3, 4, 5].map((s) => <FaStar key={s} className={s <= Math.round(avg) ? '' : 'opacity-30'} />)}
                </div>
                <p className="mt-1 text-sm text-white/85">Based on 48,000+ verified reviews</p>
              </div>
            </div>
            <div className="ml-auto hidden sm:block">
              {[5, 4, 3].map((r) => {
                const count = testimonials.filter((t) => t.rating >= r).length
                return (
                  <div key={r} className="flex items-center gap-2 text-xs text-white/85">
                    <span className="w-8 font-bold">{r}★</span>
                    <div className="h-2 w-36 overflow-hidden rounded-full bg-white/20">
                      <div className="h-full rounded-full bg-amber-300" style={{ width: `${(count / testimonials.length) * 100}%` }} />
                    </div>
                    <span className="w-8">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="container-x py-12">
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <button onClick={() => setRating(0)} className={cx('chip transition-all', rating === 0 ? 'bg-gradient-to-r from-brand-600 to-ocean-500 text-white shadow-glow' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700')}>
            All reviews
          </button>
          {[5, 4.5, 4].map((r) => (
            <button key={r} onClick={() => setRating(r)} className={cx('chip transition-all', rating === r ? 'bg-gradient-to-r from-brand-600 to-ocean-500 text-white shadow-glow' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700')}>
              {r}+ stars
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((t, i) => <TestimonialCard key={t.id} testimonial={t} index={i} />)}
        </div>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  )
}
