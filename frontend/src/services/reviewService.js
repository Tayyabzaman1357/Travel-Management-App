import api, { listWithId, withId } from './api'

export const reviewService = {
  async getAll(params = {}) {
    const { data } = await api.get('/reviews', { params })
    return listWithId(data.data)
  },
  async getMine() {
    const { data } = await api.get('/reviews/my')
    return listWithId(data.data)
  },
  async add(review) {
    const { data } = await api.post('/reviews', review)
    return withId(data.data)
  },
  async update(id, patch) {
    const { data } = await api.put(`/reviews/${id}`, patch)
    return withId(data.data)
  },
  async remove(id) {
    await api.delete(`/reviews/${id}`)
    return true
  },
}
