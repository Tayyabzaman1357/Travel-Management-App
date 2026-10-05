import { RECENTLY_VIEWED_KEY } from '@/utils/constants'

const MAX_ITEMS = 8

export function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]')
  } catch {
    return []
  }
}

export function recordRecentlyViewed(item, type) {
  if (!item || !item.id) return
  try {
    const list = getRecentlyViewed().filter((r) => !(r.type === type && r.id === item.id))
    list.unshift({ type, id: item.id, item, viewedAt: new Date().toISOString() })
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list.slice(0, MAX_ITEMS)))
  } catch {
    // storage unavailable — ignore
  }
}

export function clearRecentlyViewed() {
  try {
    localStorage.removeItem(RECENTLY_VIEWED_KEY)
  } catch {}
}
