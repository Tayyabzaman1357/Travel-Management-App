import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { THEME_KEY, THEMES } from '@/utils/constants'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY)
      if (saved === THEMES.LIGHT || saved === THEMES.DARK) return saved
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT
    } catch {
      return THEMES.LIGHT
    }
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === THEMES.DARK) root.classList.add('dark')
    else root.classList.remove('dark')
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {}
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK))
  }, [])

  return <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
