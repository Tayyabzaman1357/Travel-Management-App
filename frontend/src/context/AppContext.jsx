import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { CURRENCIES, LANGUAGES, CURRENCY_KEY, LANG_KEY } from '@/utils/constants'
import { fetchRates } from '@/services/external'
import { translate } from '@/utils/i18n'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    try {
      const c = localStorage.getItem(CURRENCY_KEY)
      return CURRENCIES.find((x) => x.code === c) || CURRENCIES[0]
    } catch {
      return CURRENCIES[0]
    }
  })
  const [rates, setRates] = useState({})
  const [lang, setLang] = useState(() => {
    try {
      const l = localStorage.getItem(LANG_KEY)
      return LANGUAGES.find((x) => x.code === l) ? l : 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    let mounted = true
    fetchRates().then((r) => {
      if (mounted) setRates(r)
    })
    return () => {
      mounted = false
    }
  }, [])

  const changeCurrency = useCallback((code) => {
    const cur = CURRENCIES.find((c) => c.code === code)
    if (cur) {
      setCurrency(cur)
      try {
        localStorage.setItem(CURRENCY_KEY, code)
      } catch {}
    }
  }, [])

  const changeLang = useCallback((code) => {
    setLang(code)
    try {
      localStorage.setItem(LANG_KEY, code)
    } catch {}
  }, [])

  // Converts a USD-base amount to the active currency
  const convert = useCallback(
    (usdAmount) => {
      const rate = rates[currency.code] || currency.rate || 1
      return Number(usdAmount * rate)
    },
    [rates, currency]
  )

  const formatPrice = useCallback(
    (usdAmount, { compact = false } = {}) => {
      const value = convert(usdAmount)
      const formatted = value.toLocaleString('en-US', {
        maximumFractionDigits: value % 1 === 0 ? 0 : 2,
      })
      return `${currency.symbol}${formatted}${compact ? '' : ''}`
    },
    [convert, currency]
  )

  const t = useCallback((key) => translate(key, lang), [lang])

  const value = useMemo(
    () => ({
      currency,
      currencies: CURRENCIES,
      changeCurrency,
      convert,
      formatPrice,
      lang,
      languages: LANGUAGES,
      changeLang,
      t,
    }),
    [currency, changeCurrency, convert, formatPrice, lang, changeLang, t]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
