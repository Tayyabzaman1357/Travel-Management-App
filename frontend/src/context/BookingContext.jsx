import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { bookingService } from '@/services/bookingService'
import { useAuth } from './AuthContext'
import { BOOKING_STATUS } from '@/utils/constants'
import toast from 'react-hot-toast'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const { user } = useAuth()
  const [draft, setDraft] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  const loadBookings = useCallback(async () => {
    if (!user) {
      setBookings([])
      return
    }
    setLoading(true)
    try {
      const items = await bookingService.getMyBookings()
      setBookings(items)
    } catch {
      // keep previous state
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  // NOTE: checkout goes through paymentService.checkout (Payment page) which
  // creates the booking + payment server-side. addBooking() was removed.

  const cancelBooking = useCallback(
    async (id) => {
      await bookingService.updateStatus(id, BOOKING_STATUS.CANCELLED)
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: BOOKING_STATUS.CANCELLED } : b)))
      toast('Booking cancelled', { icon: '📋' })
    },
    []
  )

  const deleteBooking = useCallback(async (id) => {
    await bookingService.deleteBooking(id)
    setBookings((prev) => prev.filter((b) => b.id !== id))
    toast.success('Booking deleted')
  }, [])

  const clearDraft = useCallback(() => setDraft(null), [])

  const value = useMemo(
    () => ({
      draft,
      setDraft,
      clearDraft,
      bookings,
      loading,
      cancelBooking,
      deleteBooking,
      refresh: loadBookings,
    }),
    [draft, clearDraft, bookings, loading, cancelBooking, deleteBooking, loadBookings]
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export const useBookings = () => useContext(BookingContext)
