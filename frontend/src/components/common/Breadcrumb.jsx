import { Link } from 'react-router-dom'
import { FaChevronRight, FaHouse } from 'react-icons/fa6'

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
      <Link to="/" className="flex items-center gap-1.5 transition-colors hover:text-brand-600">
        <FaHouse className="text-[10px]" /> Home
      </Link>
      {items.map((item, i) => {
        const last = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-2">
            <FaChevronRight className="text-[8px] text-slate-300 dark:text-slate-600" />
            {last ? (
              <span className="font-bold text-slate-800 dark:text-white">{item.label}</span>
            ) : (
              <Link to={item.to} className="transition-colors hover:text-brand-600">
                {item.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
