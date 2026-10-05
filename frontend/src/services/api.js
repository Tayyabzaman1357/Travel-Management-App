import axios from 'axios'

// The backend REST API — set VITE_API_URL in frontend/.env to override.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const TOKEN_KEY = 'wanderlust-token'
export const SESSION_KEY = 'wanderlust-session'

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
})

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch {
    /* storage unavailable */
  }
  return config
})

// Unwrap errors to plain Error messages so callers can `toast.error(e.message)`
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    const message = err.response?.data?.message || err.message || 'Something went wrong. Please try again.'
    // Session expired / invalid token → drop it locally and notify the app
    if (status === 401) {
      try {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(SESSION_KEY)
      } catch {
        /* ignore */
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('wanderlust:unauthorized'))
      }
    }
    return Promise.reject(new Error(message))
  }
)

export default api

// Helpers to normalise backend docs (Mongo _id) into the frontend shape (id)
export const withId = (doc) =>
  doc && typeof doc === 'object' ? { ...doc, id: doc._id || doc.id } : doc

export const listWithId = (docs) => (Array.isArray(docs) ? docs.map(withId) : [])
