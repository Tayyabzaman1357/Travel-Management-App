import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import { ratingLabel } from '@/utils/format'
import { cx } from '@/utils/helpers'

export default function Rating({ value = 0, count = 0, showLabel = false, size = 'sm', className = '' }) {
  const sizes = { xs: 'text-xs', sm: 'text-sm', md: 'text-base', lg: 'text-lg' }
  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (value >= i) stars.push(<FaStar key={i} className="text-amber-400" />)
    else if (value >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-amber-400" />)
    else stars.push(<FaRegStar key={i} className="text-slate-300 dark:text-slate-600" />)
  }
  return (
    <div className={cx('flex items-center gap-1.5', className)}>
      <div className={cx('flex items-center gap-0.5', sizes[size])}>{stars}</div>
      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{value.toFixed(1)}</span>
      {count > 0 && <span className="text-xs text-slate-500 dark:text-slate-400">({count})</span>}
      {showLabel && <span className="text-xs font-medium text-brand-600 dark:text-brand-300">· {ratingLabel(value)}</span>}
    </div>
  )
}

export function ScoreBadge({ value = 0, className = '' }) {
  const color =
    value >= 4.7 ? 'bg-emerald-500' : value >= 4.3 ? 'bg-brand-500' : value >= 3.8 ? 'bg-amber-500' : 'bg-slate-500'
  return (
    <span className={cx('inline-flex h-9 w-9 items-center justify-center rounded-tl-xl rounded-br-xl text-xs font-extrabold text-white shadow-soft', color, className)}>
      {value.toFixed(1)}
    </span>
  )
}
