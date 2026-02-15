import express from 'express'

const app = express()
const PORT = process.env.PORT || 3001
const WEATHER_API_KEY = process.env.WEATHER_API_KEY

if (!WEATHER_API_KEY) {
  console.error('WEATHER_API_KEY environment variable is required')
  process.exit(1)
}

// In-memory cache: key = "lat,lon" -> { data, timestamp }
const cache: Record<string, { data: unknown; timestamp: number }> = {}
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

function getCacheKey(lat: string, lon: string): string {
  return `${lat},${lon}`
}

app.get('/weather', async (req, res) => {
  const lat = (req.query.lat as string) || '60.16952'
  const lng = (req.query.lng as string) || '24.93545'
  const key = getCacheKey(lat, lng)

  const cached = cache[key]
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    res.json(cached.data)
    return
  }

  try {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&exclude=daily,minutely&appid=${WEATHER_API_KEY}`
    const response = await fetch(url)

    if (!response.ok) {
      res.status(response.status).json({ error: 'Weather API error' })
      return
    }

    const data = await response.json()
    cache[key] = { data, timestamp: Date.now() }
    res.json(data)
  } catch {
    res.status(500).json({ error: 'Failed to fetch weather data' })
  }
})

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`)
})
