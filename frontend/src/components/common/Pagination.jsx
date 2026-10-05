import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { cx } from '@/utils/helpers'

export default function Pagination({ page, totalPages, onChange, className = '' }) {
  if (totalPages <= 1) return null
  const pages = []
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, page + 2)
  for (let i = start; i <= end; i++) pages.push(i)

  const btn = (active) =>
    cx(
      'flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all duration-200',
      active
        ? 'bg-gradient-to-r from-brand-600 to-ocean-500 text-white shadow-glow'
        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
    )

  return (
    <div className={cx('mt-10 flex items-center justify-center gap-2', className)}>
      <button className={btn(false)} onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} aria-label="Previous page">
        <FaChevronLeft />
      </button>
      {start > 1 && (
        <>
          <button className={btn(false)} onClick={() => onChange(1)}>1</button>
          {start > 2 && <span className="px-1 text-slate-400">…</span>}
        </>
      )}
      {pages.map((p) => (
        <button key={p} className={btn(p === page)} onClick={() => onChange(p)}>
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-slate-400">…</span>}
          <button className={btn(false)} onClick={() => onChange(totalPages)}>{totalPages}</button>
        </>
      )}
      <button className={btn(false)} onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} aria-label="Next page">
        <FaChevronRight />
      </button>
    </div>
  )
}
