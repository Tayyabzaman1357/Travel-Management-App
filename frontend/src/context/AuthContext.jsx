import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { authService } from '@/services/authService'
import { USER_ROLES } from '@/utils/constants'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const initial = authService.getSession()
    if (initial) {
      setUser(initial)
    }
    // Only validate when a token actually exists (avoids a pointless 401 on guest loads)
    if (authService.getToken()) {
      // Validate the stored JWT against the backend and refresh the user
      authService
        .fetchMe()
        .then((u) => {
          if (mounted) setUser(u)
        })
        .catch(() => {
          if (mounted) setUser(null)
        })
        .finally(() => {
          if (mounted) setLoading(false)
        })
    } else {
      setLoading(false)
    }
    // Force logout on expired tokens mid-session (dispatched by the api client)
    const onUnauthorized = () => mounted && setUser(null)
    window.addEventListener('wanderlust:unauthorized', onUnauthorized)
    const unsub = authService.onSessionChange((u) => mounted && setUser(u))
    return () => {
      mounted = false
      window.removeEventListener('wanderlust:unauthorized', onUnauthorized)
      unsub()
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    const u = await authService.signIn(email, password)
    setUser(u)
    return u
  }, [])

  const signUp = useCallback(async (name, email, password) => {
    const u = await authService.signUp(name, email, password)
    setUser(u)
    return u
  }, [])

  const signInWithGoogle = useCallback(async () => {
    const u = await authService.signInWithGoogle()
    setUser(u)
    return u
  }, [])

  const signOut = useCallback(async () => {
    await authService.signOut()
    setUser(null)
  }, [])

  const resetPassword = useCallback((email) => authService.resetPassword(email), [])

  const updateProfile = useCallback(
    async (data) => {
      if (!user) throw new Error('Not authenticated')
      const updated = await authService.updateProfile(user.id, data)
      const next = { ...user, ...(updated || data) }
      setUser(next)
      return next
    },
    [user]
  )

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === USER_ROLES.ADMIN,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      resetPassword,
      updateProfile,
    }),
    [user, loading, signIn, signUp, signInWithGoogle, signOut, resetPassword, updateProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
