import axios from 'axios'
import { CURRENCIES } from '@/utils/constants'

// Weather — Open-Meteo (free, no API key required)
export async function fetchWeather(lat, lng) {
  try {
    const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lng,
        current_weather: true,
        daily: 'temperature_2m_max,temperature_2m_min,weathercode',
        timezone: 'auto',
      },
      timeout: 8000,
    })
    const cw = data.current_weather
    const codes = data.daily?.weathercode || []
    return {
      temp: Math.round(cw.temperature),
      windSpeed: cw.windspeed,
      condition: weatherCodeToText(cw.weathercode),
      icon: weatherCodeToIcon(cw.weathercode),
      forecast: (codes.slice(0, 5) || []).map((code, i) => ({
        day: ['Today', 'Tue', 'Wed', 'Thu', 'Fri'][i] || `Day ${i + 1}`,
        tempMax: Math.round(data.daily.temperature_2m_max[i]),
        tempMin: Math.round(data.daily.temperature_2m_min[i]),
        icon: weatherCodeToIcon(code),
        condition: weatherCodeToText(code),
      })),
    }
  } catch {
    return null
  }
}

// Live currency rates (keyless, CORS-enabled via open.er-api.com). Falls back to static table.
let ratesCache = null
export async function fetchRates() {
  if (ratesCache) return ratesCache
  const endpoints = [
    'https://open.er-api.com/v6/latest/USD',
    'https://api.frankfurter.app/latest?from=USD',
  ]
  for (const url of endpoints) {
    try {
      const { data } = await axios.get(url, { timeout: 6000 })
      const rates = { USD: 1, ...(data.rates || data.conversion_rates) }
      if (Object.keys(rates).length > 1) {
        ratesCache = rates
        return rates
      }
    } catch {
      // try next endpoint
    }
  }
  const staticRates = {}
  CURRENCIES.forEach((c) => (staticRates[c.code] = c.rate))
  return staticRates
}

function weatherCodeToText(code) {
  if (code === 0) return 'Clear Sky'
  if (code === 1 || code === 2) return 'Partly Cloudy'
  if (code === 3) return 'Overcast'
  if (code >= 45 && code <= 48) return 'Foggy'
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'Rain Showers'
  if (code >= 71 && code <= 77) return 'Snowfall'
  if (code >= 95) return 'Thunderstorm'
  return 'Cloudy'
}

function weatherCodeToIcon(code) {
  if (code === 0) return 'sunny'
  if (code === 1 || code === 2) return 'cloudy'
  if (code === 3) return 'cloud'
  if (code >= 45 && code <= 48) return 'fog'
  if (code >= 51 && code <= 67) return 'rainy'
  if (code >= 71 && code <= 77) return 'snow'
  if (code >= 95) return 'storm'
  return 'cloud'
}
