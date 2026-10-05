import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { catalogService } from '@/services/catalogService'
// Static catalog — used as metadata sources and as an offline fallback if the API is unreachable
import { getHotel } from '@/data/hotels'
import { getFlight } from '@/data/flights'
import { getTour } from '@/data/tours'
import { getDestination } from '@/data/destinations'
import { getCar } from '@/data/cars'
import { getCruise } from '@/data/cruises'
import { getInsurancePlan } from '@/data/insurance'

const CatalogContext = createContext(null)

export function CatalogProvider({ children }) {
  const [hotels, setHotels] = useState([])
  const [flights, setFlights] = useState([])
  const [tours, setTours] = useState([])
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [degraded, setDegraded] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const [h, f, t, d] = await Promise.all([
          catalogService.hotels.list(),
          catalogService.flights.list(),
          catalogService.tours.list(),
          catalogService.destinations.list(),
        ])
        if (!mounted) return
        setHotels(h); setFlights(f); setTours(t); setDestinations(d)
        setDegraded(false)
      } catch (e) {
        if (!mounted) return
        console.warn('[catalog] API unavailable — using bundled fallback catalog:', e.message)
        const [{ hotels: fh }, { flights: ff }, { tours: ft }, { destinations: fd }] = await Promise.all([
          import('@/data/hotels'), import('@/data/flights'), import('@/data/tours'), import('@/data/destinations'),
        ])
        if (!mounted) return
        setHotels(fh); setFlights(ff); setTours(ft); setDestinations(fd)
        setDegraded(true)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  // Resolve an item by type + id — falls back to the bundled static data so
  // deep links (e.g. /booking?type=hotel&id=h1) keep working.
  const getItem = useCallback(
    (type, id) => {
      const find = (arr) => arr.find((x) => x.id === id || x._id === id)
      switch (type) {
        case 'hotel': return find(hotels) || getHotel(id)
        case 'flight': return find(flights) || getFlight(id)
        case 'tour': return find(tours) || getTour(id)
        case 'destination': return find(destinations) || getDestination(id)
        case 'car': return getCar(id)
        case 'cruise': return getCruise(id)
        case 'insurance': return getInsurancePlan(id)
        default: return null
      }
    },
    [hotels, flights, tours, destinations]
  )

  const refetch = useCallback(() => {
    setLoading(true)
    return Promise.all([
      catalogService.hotels.list(),
      catalogService.flights.list(),
      catalogService.tours.list(),
      catalogService.destinations.list(),
    ])
      .then(([h, f, t, d]) => {
        setHotels(h); setFlights(f); setTours(t); setDestinations(d)
        setDegraded(false)
      })
      .catch(() => {
        setDegraded(true)
      })
      .finally(() => setLoading(false))
  }, [])

  const value = useMemo(
    () => ({ hotels, flights, tours, destinations, loading, error, degraded, getItem, refetch }),
    [hotels, flights, tours, destinations, loading, error, degraded, getItem, refetch]
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export const useCatalog = () => useContext(CatalogContext)
