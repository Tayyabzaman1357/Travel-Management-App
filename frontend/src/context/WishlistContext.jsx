import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { wishlistService } from '@/services/wishlistService'
import { WISHLIST_KEY } from '@/utils/constants'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const WishlistContext = createContext(null)

const readLocal = () => {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]')
  } catch {
    return []
  }
}

// Entry shape: { id (item id), docId (API doc id when synced), type, item, savedAt }
export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState(readLocal)
  const syncing = useRef(false)

  // Reset to the guest (local) store when signed out
  useEffect(() => {
    if (!user) setWishlist(readLocal())
  }, [user])

  // Load from the API whenever the user changes
  useEffect(() => {
    if (!user) return
    let mounted = true
    wishlistService
      .getMine()
      .then((docs) => {
        if (!mounted) return
        setWishlist(
          docs.map((d) => ({
            id: d.itemId,
            docId: d.id,
            type: d.type,
            item: d.item,
            savedAt: d.savedAt,
          }))
        )
      })
      .catch(() => {})
    return () => { mounted = false }
  }, [user])

  const isSaved = useCallback(
    (type, id) => wishlist.some((w) => w.type === type && w.id === id),
    [wishlist]
  )

  const toggleWishlist = useCallback(
    async (item, type) => {
      const exists = wishlist.some((w) => w.type === type && w.id === item.id)

      if (user) {
        if (syncing.current) return
        syncing.current = true
        try {
          if (exists) {
            const entry = wishlist.find((w) => w.type === type && w.id === item.id)
            if (entry?.docId) await wishlistService.remove(entry.docId)
            else await wishlistService.removeByItem(type, item.id)
            setWishlist((prev) => prev.filter((w) => !(w.type === type && w.id === item.id)))
            toast('Removed from wishlist', { icon: '💔' })
          } else {
            const doc = await wishlistService.add({ type, itemId: item.id, item })
            setWishlist((prev) => [
              { id: item.id, docId: doc.id, type, item, savedAt: doc.savedAt },
              ...prev,
            ])
            toast.success('Saved to wishlist ❤️')
          }
        } catch (e) {
          toast.error(e.message || 'Could not update wishlist')
        } finally {
          syncing.current = false
        }
        return
      }

      // Guest → localStorage
      setWishlist((prev) => {
        const existsLocal = prev.some((w) => w.type === type && w.id === item.id)
        if (existsLocal) {
          toast('Removed from wishlist', { icon: '💔' })
          return prev.filter((w) => !(w.type === type && w.id === item.id))
        }
        toast.success('Saved to wishlist ❤️ — sign in to sync across devices')
        return [{ type, id: item.id, item, savedAt: new Date().toISOString() }, ...prev]
      })
    },
    [user, wishlist]
  )

  const removeItem = useCallback(
    async (type, id) => {
      const entry = wishlist.find((w) => w.type === type && w.id === id)
      setWishlist((prev) => prev.filter((w) => !(w.type === type && w.id === id)))
      if (user && entry?.docId) {
        try {
          await wishlistService.remove(entry.docId)
        } catch {}
      }
    },
    [user, wishlist]
  )

  const clearAll = useCallback(async () => {
    const docs = wishlist.filter((w) => w.docId)
    setWishlist([])
    if (user && docs.length) {
      try {
        await Promise.all(docs.map((d) => wishlistService.remove(d.docId)))
      } catch {}
    }
  }, [user, wishlist])

  // Persist guest wishlist to localStorage
  useEffect(() => {
    if (user) return
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
    } catch {}
  }, [wishlist, user])

  const value = useMemo(
    () => ({ wishlist, isSaved, toggleWishlist, removeItem, clearAll, count: wishlist.length }),
    [wishlist, isSaved, toggleWishlist, removeItem, clearAll]
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export const useWishlist = () => useContext(WishlistContext)
