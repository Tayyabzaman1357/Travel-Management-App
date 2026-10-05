import api, { listWithId, withId } from './api'

export const paymentService = {
  // Simulated checkout — creates the Booking + Payment records server-side
  async checkout(payload) {
    const { data } = await api.post('/payments', payload)
    return {
      payment: withId(data.data.payment),
      booking: withId(data.data.booking),
    }
  },
  async getMine() {
    const { data } = await api.get('/payments/my')
    return listWithId(data.data)
  },
  async getAll() {
    const { data } = await api.get('/payments')
    return listWithId(data.data)
  },
  async updateStatus(id, status) {
    const { data } = await api.put(`/payments/${id}`, { status })
    return withId(data.data)
  },
}
