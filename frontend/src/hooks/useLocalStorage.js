import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  }, [key, value])

  const remove = useCallback(() => {
    try {
      localStorage.removeItem(key)
      setValue(initialValue)
    } catch {}
  }, [key, initialValue])

  return [value, setValue, remove]
}
