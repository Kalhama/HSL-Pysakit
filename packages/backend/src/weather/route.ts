import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { TtlCache } from './cache.js'
import { fetchMetNoForecast, type WeatherResponse } from './metno.js'

const CACHE_TTL_MS = 10 * 60 * 1000
const cache = new TtlCache<WeatherResponse>(CACHE_TTL_MS)

const querySchema = z.object({
  // Default to Helsinki central railway station, matching the frontend's previous default.
  lat: z.coerce.number().min(-90).max(90).default(60.16952),
  lng: z.coerce.number().min(-180).max(180).default(24.93545)
})

export const weatherRoute = new Hono().get('/weather', zValidator('query', querySchema), async (c) => {
  const { lat, lng } = c.req.valid('query')
  const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`

  const cached = cache.get(cacheKey)
  if (cached) return c.json(cached)

  try {
    const forecast = await fetchMetNoForecast(lat, lng)
    cache.set(cacheKey, forecast)
    return c.json(forecast)
  } catch (err) {
    console.error('Failed to fetch forecast from met.no', err)
    return c.json({ error: 'Failed to fetch weather data' }, 502)
  }
})
