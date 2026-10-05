// General helpers: classnames, misc

export function cx(...args) {
  return args.filter(Boolean).join(' ')
}

export function uid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max)
}

export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key]
    acc[k] = acc[k] || []
    acc[k].push(item)
    return acc
  }, {})
}

export function unique(arr) {
  return [...new Set(arr)]
}

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function maskCardNumber(num) {
  const digits = num.replace(/\D/g, '')
  return `•••• ${digits.slice(-4)}`
}
