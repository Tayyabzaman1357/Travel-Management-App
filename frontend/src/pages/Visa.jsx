import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FaPassport, FaMagnifyingGlass, FaFileLines, FaListCheck, FaCircleCheck } from 'react-icons/fa6'
import Breadcrumb from '@/components/common/Breadcrumb'
import Accordion from '@/components/common/Accordion'
import Img from '@/components/common/Img'
import { visaCountries, visaProcessSteps, visaFaqs } from '@/data/countries'
import { useApp } from '@/context/AppContext'
import { useSEO } from '@/utils/seo'
import { formatCurrency } from '@/utils/format'

export default function Visa() {
  const { currency } = useApp()
  useSEO('Visa Assistance — Wanderlust', 'Get expert visa guidance, document checks and tracking for 50+ countries.')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(visaCountries[0])

  const filtered = visaCountries.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.visaType.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="pt-28">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-ocean-500 pb-14">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="container-x relative">
          <div className="mb-6"><Breadcrumb items={[{ label: 'Visa Assistance' }]} /></div>
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-5xl">Visa Made Simple</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base">
            Document checklists, expert review and real-time tracking for 50+ countries — so you can focus on the adventure, not the paperwork.
          </p>
          <div className="glass-strong mt-8 flex max-w-md items-center gap-3 rounded-full p-2 pl-5">
            <FaMagnifyingGlass className="text-brand-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search country or visa type…" className="w-full bg-transparent text-sm outline-none" />
          </div>
        </div>
      </div>

      {/* Countries */}
      <div className="container-x py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            {filtered.map((c, i) => (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(c)}
                className="glass flex w-full items-center gap-4 rounded-2xl p-4 text-left card-hover"
              >
                <Img src={c.image} seed={`visa-${c.id}`} alt={c.name} className="h-14 w-14 rounded-2xl object-cover" />
                <div className="flex-1">
                  <p className="font-display text-sm font-extrabold text-slate-900 dark:text-white">{c.flag} {c.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{c.visaType}</p>
                </div>
                <span className={`h-2.5 w-2.5 rounded-full ${selected.id === c.id ? 'bg-brand-500 ring-4 ring-brand-500/20' : 'bg-slate-300 dark:bg-slate-600'}`} />
              </motion.button>
            ))}
            {filtered.length === 0 && <p className="text-sm text-slate-500">No countries match “{query}”.</p>}
          </div>

          {/* Selected country detail */}
          <div className="lg:col-span-2">
            <motion.div key={selected.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass overflow-hidden rounded-3xl">
              <div className="relative h-48">
                <Img src={selected.image} seed={`visa-b-${selected.id}`} alt={selected.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <h2 className="font-display text-2xl font-extrabold text-white">{selected.flag} {selected.name} Visa</h2>
                  <p className="text-sm text-white/85">{selected.visaType}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{selected.description}</p>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    ['Processing', selected.processingTime],
                    ['Visa Fee', formatCurrency(selected.fee * (currency.rate || 1), currency.code, currency.symbol)],
                    ['Validity', selected.validity],
                    ['Entries', 'Multiple'],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-2xl bg-brand-500/5 p-4 text-center">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{k}</p>
                      <p className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">{v}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <p className="mb-3 flex items-center gap-2 font-display text-sm font-extrabold text-slate-900 dark:text-white">
                    <FaFileLines className="text-brand-500" /> Required Documents
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {selected.requirements.map((r) => (
                      <div key={r} className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 px-3 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <FaCircleCheck className="shrink-0 text-emerald-500" /> {r}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => toast.success(`Visa application started for ${selected.name}! Our experts will contact you shortly.`)}
                  className="btn-primary mt-6 w-full !py-4"
                >
                  <FaPassport /> Start {selected.name} Visa Application
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Process steps */}
        <div className="mt-16">
          <h2 className="mb-8 text-center font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
            How it works — <span className="text-gradient">4 simple steps</span>
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visaProcessSteps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass relative rounded-3xl p-6 card-hover"
              >
                <span className="font-display text-5xl font-extrabold text-brand-500/15">{s.step}</span>
                <h3 className="mt-3 font-display text-lg font-extrabold text-slate-900 dark:text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{s.text}</p>
                {i < 3 && <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-brand-400 lg:block">→</span>}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Visa FAQ */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold text-slate-900 dark:text-white">
              <FaListCheck className="text-brand-500" /> Visa FAQ
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Common questions travelers ask about visas. For anything else, our experts are one click away.</p>
            <div className="glass mt-6 rounded-3xl p-6">
              <p className="font-display text-lg font-extrabold text-slate-900 dark:text-white">Need urgent help?</p>
              <p className="mt-1 text-sm text-slate-500">Chat with a visa expert 24/7.</p>
              <button onClick={() => toast.success('An expert will reach out within minutes!')} className="btn-primary mt-4 w-full text-xs">Get expert help</button>
            </div>
          </div>
          <div className="lg:col-span-3">
            <Accordion items={visaFaqs} />
          </div>
        </div>
      </div>
    </div>
  )
}
