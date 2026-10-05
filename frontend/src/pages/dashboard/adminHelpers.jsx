import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaPencil, FaTrashCan, FaXmark, FaMagnifyingGlass } from 'react-icons/fa6'
import Img from '@/components/common/Img'
import Modal from '@/components/common/Modal'
import EmptyState from '@/components/common/EmptyState'
import { cx } from '@/utils/helpers'

export function AdminStat({ label, value, icon, trend, sub }) {
  return (
    <div className="glass rounded-3xl p-5 card-hover">
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/15 to-ocean-500/15 text-xl text-brand-500">{icon}</span>
        {trend !== undefined && (
          <span className={cx('chip', trend >= 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-accent-500/10 text-accent-600')}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      {sub && <p className="mt-0.5 text-[11px] text-slate-400">{sub}</p>}
    </div>
  )
}

export function AdminTable({ title, subtitle, columns, rows, onAdd, onEdit, onDelete, addLabel = 'Add new', searchKeys = [], loading }) {
  const [query, setQuery] = useState('')
  const filtered = rows.filter((r) => !query || searchKeys.some((k) => String(r[k] || '').toLowerCase().includes(query.toLowerCase())))
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState(1)
  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0
    const av = a[sortKey]; const bv = b[sortKey]
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * sortDir
    return String(av || '').localeCompare(String(bv || '')) * sortDir
  })

  return (
    <div className="glass overflow-hidden rounded-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800 p-5">
        <div>
          <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className="input-base !w-44 !py-2 !pl-8 text-xs" />
          </div>
          {onAdd && (
            <button onClick={onAdd} className="btn-primary !px-4 !py-2 text-xs"><FaPlus /> {addLabel}</button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="space-y-3 p-5">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-12 w-full rounded-xl" />)}</div>
        ) : sorted.length === 0 ? (
          <div className="p-5"><EmptyState title="No records found" text="Try a different search or add a new record." /></div>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                {columns.map((c) => (
                  <th key={c.key} className="px-5 py-3 font-bold">
                    {c.sortable ? (
                      <button
                        onClick={() => { setSortDir(sortKey === c.key ? -sortDir : 1); setSortKey(c.key) }}
                        className="flex items-center gap-1 hover:text-brand-600"
                      >
                        {c.label} {sortKey === c.key ? (sortDir === 1 ? '↑' : '↓') : ''}
                      </button>
                    ) : c.label}
                  </th>
                ))}
                <th className="px-5 py-3 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 dark:border-slate-800/60 transition-colors last:border-0 hover:bg-brand-500/5">
                  {columns.map((c) => (
                    <td key={c.key} className="px-5 py-3.5">
                      {c.render ? c.render(row) : String(row[c.key] ?? '—')}
                    </td>
                  ))}
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      {onEdit && (
                        <button onClick={() => onEdit(row)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 transition-all hover:bg-brand-500 hover:text-white" aria-label="Edit"><FaPencil className="text-xs" /></button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(row)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 transition-all hover:bg-accent-500 hover:text-white" aria-label="Delete"><FaTrashCan className="text-xs" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="border-t border-slate-200/60 dark:border-slate-800 px-5 py-3 text-xs font-semibold text-slate-400">
        {sorted.length} record{sorted.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}

export function EditorModal({ open, onClose, title, fields, values, onSubmit, submitLabel = 'Save' }) {
  const [form, setForm] = useState(values || {})
  const [errors, setErrors] = useState({})

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    fields.forEach((f) => {
      const v = form[f.key]
      if (f.required && (v === undefined || v === null || v === '')) errs[f.key] = `${f.label} is required`
      if (f.type === 'number' && v !== undefined && v !== '' && isNaN(Number(v))) errs[f.key] = `${f.label} must be a number`
      if (f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) errs[f.key] = 'Enter a valid email'
    })
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    onSubmit(form)
  }

  return (
    <Modal open={open} onClose={onClose} title={title} size="lg">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2" noValidate>
        {fields.map((f) => (
          <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
            <label className="mb-1.5 block text-xs font-bold text-slate-500">{f.label}{f.required ? ' *' : ''}</label>
            {f.type === 'select' ? (
              <select value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} className="input-base">
                <option value="">Select…</option>
                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} rows={3} className="input-base resize-none" />
            ) : f.type === 'checkbox' ? (
              <label className="flex cursor-pointer items-center gap-2 pt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <input type="checkbox" checked={Boolean(form[f.key])} onChange={(e) => set(f.key, e.target.checked)} className="h-4 w-4 accent-brand-600" /> Enabled
              </label>
            ) : (
              <input
                type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                step={f.step}
                min={f.min}
                value={form[f.key] ?? ''}
                onChange={(e) => set(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="input-base"
              />
            )}
            {errors[f.key] && <p className="mt-1 text-xs font-semibold text-accent-500">{errors[f.key]}</p>}
          </div>
        ))}
        <div className="flex gap-3 pt-2 sm:col-span-2">
          <button type="button" onClick={onClose} className="btn-outline flex-1 text-xs"><FaXmark /> Cancel</button>
          <button type="submit" className="btn-primary flex-1 text-xs"><FaPlus /> {submitLabel}</button>
        </div>
      </form>
    </Modal>
  )
}

export function Thumb({ src, seed, name }) {
  return <div className="flex items-center gap-3"><Img src={src} seed={seed} alt="" className="h-10 w-12 shrink-0 rounded-lg object-cover" /><span className="font-semibold text-slate-800 dark:text-slate-100">{name}</span></div>
}

export function StatusPill({ status }) {
  const map = {
    confirmed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    cancelled: 'bg-accent-500/10 text-accent-600 dark:text-accent-400',
    completed: 'bg-slate-500/10 text-slate-500 dark:text-slate-400',
    active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    published: 'bg-brand-500/10 text-brand-600 dark:text-brand-300',
    draft: 'bg-slate-500/10 text-slate-500 dark:text-slate-400',
    admin: 'bg-brand-500/10 text-brand-600 dark:text-brand-300',
    user: 'bg-ocean-500/10 text-ocean-600 dark:text-ocean-400',
  }
  return <span className={cx('chip capitalize', map[status] || 'bg-slate-500/10 text-slate-500')}>{status}</span>
}

export function Donut({ segments, size = 160 }) {
  // segments: [{label, value, color}]
  const total = segments.reduce((a, s) => a + s.value, 0) || 1
  let acc = 0
  const stops = segments.map((s) => {
    const from = (acc / total) * 360
    acc += s.value
    const to = (acc / total) * 360
    return `${s.color} ${from}deg ${to}deg`
  })
  return (
    <div className="flex items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <div className="h-full w-full rounded-full" style={{ background: `conic-gradient(${stops.join(', ')})` }} />
        <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white dark:bg-slate-900">
          <span className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">{total}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</span>
        </div>
      </div>
      <div className="space-y-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
            <span className="ml-auto font-extrabold text-slate-900 dark:text-white">{Math.round((s.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BarChart({ data, height = 160 }) {
  // data: [{label, value, color?}]
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex h-full items-end justify-between gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="group flex flex-1 flex-col items-center gap-1.5">
          <span className="text-[10px] font-extrabold text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">{d.value}</span>
          <div
            className="w-full max-w-[34px] rounded-t-lg bg-gradient-to-t from-brand-600 to-ocean-400 transition-all duration-500 group-hover:brightness-110"
            style={{ height: `${Math.max((d.value / max) * (height - 34), 6)}px` }}
          />
          <span className="text-[10px] font-bold text-slate-400">{d.label}</span>
        </div>
      ))}
    </div>
  )
}
