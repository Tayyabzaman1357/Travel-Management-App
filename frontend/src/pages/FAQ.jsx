import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FaMagnifyingGlass, FaComments } from 'react-icons/fa6'
import Accordion from '@/components/common/Accordion'
import Breadcrumb from '@/components/common/Breadcrumb'
import { faqs } from '@/data/faqs'
import { useSEO } from '@/utils/seo'
import { cx } from '@/utils/helpers'

export default function FAQ() {
  useSEO('FAQ — Wanderlust', 'Answers to common questions about bookings, payments, flights, hotels, visas and more.')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = useMemo(() => {
    let cats = faqs
    if (category !== 'All') cats = faqs.filter((f) => f.category === category)
    return cats
      .map((f) => ({
        category: f.category,
        items: f.items.filter((i) => !query || i.q.toLowerCase().includes(query.toLowerCase()) || i.a.toLowerCase().includes(query.toLowerCase())),
      }))
      .filter((f) => f.items.length > 0)
  }, [query, category])

  const total = filtered.reduce((acc, f) => acc + f.items.length, 0)

  return (
    <div className="pt-28">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-ocean-500 pb-14">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="container-x relative">
          <div className="mb-6"><Breadcrumb items={[{ label: 'FAQ' }]} /></div>
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-3 max-w-xl text-sm text-white/85 sm:text-base">Everything you need to know about booking, paying and travelling with Wanderlust.</p>
          <div className="glass-strong mt-8 flex max-w-md items-center gap-3 rounded-full p-2 pl-5">
            <FaMagnifyingGlass className="text-brand-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search questions…" className="w-full bg-transparent text-sm outline-none" />
          </div>
        </div>
      </div>

      <div className="container-x py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          {['All', ...faqs.map((f) => f.category)].map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={cx('chip transition-all', category === c ? 'bg-gradient-to-r from-brand-600 to-ocean-500 text-white shadow-glow' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700')}>
              {c}
              {c !== 'All' && <span className="ml-1 opacity-70">({faqs.find((f) => f.category === c)?.items.length})</span>}
            </button>
          ))}
        </div>

        {total === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
            <p className="font-display text-lg font-extrabold text-slate-900 dark:text-white">No questions match “{query}”</p>
            <p className="mt-1 text-sm text-slate-500">Try different keywords or contact our support team.</p>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-8">
            {filtered.map((f) => (
              <div key={f.category}>
                <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-extrabold text-slate-900 dark:text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600">{f.category.charAt(0)}</span>
                  {f.category}
                </h2>
                <Accordion items={f.items} />
              </div>
            ))}
          </div>
        )}

        <div className="glass mx-auto mt-12 flex max-w-3xl flex-col items-center gap-4 rounded-3xl p-8 text-center">
          <FaComments className="text-3xl text-brand-500" />
          <h2 className="font-display text-xl font-extrabold text-slate-900 dark:text-white">Still have questions?</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Our support team replies within 15 minutes — day or night.</p>
          <div className="flex gap-3">
            <Link to="/contact" className="btn-primary text-xs">Contact support</Link>
            <Link to="/blog" className="btn-outline text-xs">Browse guides</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
