import api, { listWithId, withId } from './api'

export const wishlistService = {
  async getMine() {
    const { data } = await api.get('/wishlist')
    return listWithId(data.data)
  },
  async add({ type, itemId, item }) {
    const { data } = await api.post('/wishlist', { type, itemId, item })
    return withId(data.data)
  },
  async remove(id) {
    await api.delete(`/wishlist/${id}`)
    return true
  },
  async removeByItem(type, itemId) {
    await api.delete(`/wishlist/item/${type}/${itemId}`)
    return true
  },
}
