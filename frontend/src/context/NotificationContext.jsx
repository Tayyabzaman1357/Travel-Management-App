import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { notificationService } from '@/services/bookingService'
import { useAuth } from './AuthContext'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!user) {
      setNotifications([])
      return
    }
    setLoading(true)
    try {
      const items = await notificationService.getMine(user.id)
      setNotifications(items)
    } catch {
      // keep previous state
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  const markRead = useCallback(
    async (id) => {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
      try {
        await notificationService.markRead(id)
      } catch {}
    },
    []
  )

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    if (user) {
      try {
        await notificationService.markAllRead(user.id)
      } catch {}
    }
  }, [user])

  const push = useCallback(
    async (data) => {
      if (!user) return
      const n = await notificationService.push(user.id, data)
      setNotifications((prev) => [n, ...prev])
    },
    [user]
  )

  const remove = useCallback(
    async (id) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      try {
        await notificationService.remove(id)
      } catch {}
    },
    []
  )

  const value = useMemo(
    () => ({
      notifications,
      loading,
      unreadCount: notifications.filter((n) => !n.read).length,
      markRead,
      markAllRead,
      push,
      remove,
      refresh: load,
    }),
    [notifications, loading, markRead, markAllRead, push, remove, load]
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export const useNotifications = () => useContext(NotificationContext)
