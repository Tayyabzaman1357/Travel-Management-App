export function CardSkeleton({ withImage = true }) {
  return (
    <div className="skeleton overflow-hidden rounded-2xl bg-slate-200/70 dark:bg-slate-800/70">
      {withImage && <div className="h-44 w-full" />}
      <div className="space-y-3 p-5">
        <div className="h-4 w-3/4" />
        <div className="h-3 w-1/2" />
        <div className="h-8 w-full" />
      </div>
    </div>
  )
}

export function GridSkeleton({ count = 8, withImage = true, cols = 4 }) {
  const colClass = { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[cols] || 'sm:grid-cols-2 lg:grid-cols-4'
  return (
    <div className={`grid grid-cols-1 gap-6 ${colClass}`}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} withImage={withImage} />
      ))}
    </div>
  )
}

export function ListSkeleton({ count = 4 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton h-32 w-full rounded-2xl" />
      ))}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500/20 border-t-brand-500" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading…</p>
      </div>
    </div>
  )
}
