import api, { TOKEN_KEY, SESSION_KEY } from './api'

// ── Session persistence (localStorage + in-memory subscribers) ─────────────

const sessionStore = {
  get() {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
  set(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    this._emit()
  },
  clear() {
    localStorage.removeItem(SESSION_KEY)
    this._emit()
  },
  _listeners: new Set(),
  _emit() {
    this._listeners.forEach((cb) => cb(this.get()))
  },
  subscribe(cb) {
    this._listeners.add(cb)
    return () => this._listeners.delete(cb)
  },
}

const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

const commit = (token, user) => {
  tokenStore.set(token)
  sessionStore.set(user)
  return user
}

// ── API-backed auth ─────────────────────────────────────────────────────────

export const authService = {
  async signUp(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password })
    return commit(data.token, data.user)
  },

  async signIn(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    return commit(data.token, data.user)
  },

  // Demo Google sign-in — the backend issues a JWT for a generated Google account
  async signInWithGoogle() {
    const { data } = await api.post('/auth/google')
    return commit(data.token, data.user)
  },

  async resetPassword(email) {
    const { data } = await api.post('/auth/forgot-password', { email })
    return data
  },

  async confirmResetPassword(token, password) {
    const { data } = await api.post('/auth/reset-password', { token, password })
    return data
  },

  async updateProfile(userId, data) {
    const { data: res } = await api.put('/auth/update-profile', data)
    sessionStore.set(res.user)
    return res.user
  },

  // Validates the stored token on app start and refreshes the session user
  async fetchMe() {
    try {
      const { data } = await api.get('/auth/me')
      sessionStore.set(data.user)
      return data.user
    } catch {
      tokenStore.clear()
      sessionStore.clear()
      return null
    }
  },

  async signOut() {
    tokenStore.clear()
    sessionStore.clear()
  },

  getSession: () => sessionStore.get(),
  getToken: () => tokenStore.get(),
  onSessionChange: (cb) => sessionStore.subscribe(cb),
}
