import { FaSuitcaseRolling } from 'react-icons/fa6'

export default function EmptyState({ icon, title = 'Nothing here yet', text, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/40 px-6 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500/15 to-ocean-500/15 text-4xl text-brand-500">
        {icon || <FaSuitcaseRolling />}
      </div>
      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
      {text && <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">{text}</p>}
      {action}
    </div>
  )
}
