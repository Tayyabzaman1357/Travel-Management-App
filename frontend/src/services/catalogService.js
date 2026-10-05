import api, { listWithId, withId } from './api'

// Each resource: list(filters), get(id), create(data), update(id, patch), remove(id)

const makeResource = (path) => ({
  list: async (params = {}) => {
    const { data } = await api.get(path, { params })
    return listWithId(data.data)
  },
  get: async (id) => {
    const { data } = await api.get(`${path}/${id}`)
    return withId(data.data)
  },
  create: async (payload) => {
    const { data } = await api.post(path, payload)
    return withId(data.data)
  },
  update: async (id, patch) => {
    const { data } = await api.put(`${path}/${id}`, patch)
    return withId(data.data)
  },
  remove: async (id) => {
    await api.delete(`${path}/${id}`)
    return true
  },
})

export const hotelService = makeResource('/hotels')
export const flightService = makeResource('/flights')
export const tourService = makeResource('/tours')
export const destinationService = makeResource('/destinations')

export const catalogService = {
  hotels: hotelService,
  flights: flightService,
  tours: tourService,
  destinations: destinationService,
}
