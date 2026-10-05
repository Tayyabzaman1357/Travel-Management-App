import api, { listWithId, withId } from './api'

export const userService = {
  async list(params = {}) {
    const { data } = await api.get('/users', { params })
    return listWithId(data.data)
  },
  async get(id) {
    const { data } = await api.get(`/users/${id}`)
    return withId(data.data)
  },
  async update(id, patch) {
    const { data } = await api.put(`/users/${id}`, patch)
    return withId(data.data)
  },
  async remove(id) {
    await api.delete(`/users/${id}`)
    return true
  },
}
