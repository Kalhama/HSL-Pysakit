import { z } from 'zod'
import { symbolCodeToOwmIcon } from './symbolIcon.js'

const USER_AGENT = process.env.MET_USER_AGENT ?? 'hsl-pysakit/1.0 github.com/kalhama/hsl-pysakit'

const summarySchema = z.object({
  summary: z.object({ symbol_code: z.string() })
})

const timeseriesEntrySchema = z.object({
  time: z.string(),
  data: z.object({
    instant: z.object({
      details: z.object({ air_temperature: z.number() })
    }),
    next_1_hours: summarySchema.optional(),
    next_6_hours: summarySchema.optional(),
    next_12_hours: summarySchema.optional()
  })
})

const locationforecastSchema = z.object({
  properties: z.object({
    timeseries: z.array(timeseriesEntrySchema).min(1)
  })
})

type TimeseriesEntry = z.infer<typeof timeseriesEntrySchema>

export interface WeatherPoint {
  dt: number
  temp: number
  icon: string
}

export interface WeatherResponse {
  current: WeatherPoint
  hourly: WeatherPoint[]
}

function toWeatherPoint(entry: TimeseriesEntry): WeatherPoint {
  const symbolCode =
    entry.data.next_1_hours?.summary.symbol_code ??
    entry.data.next_6_hours?.summary.symbol_code ??
    entry.data.next_12_hours?.summary.symbol_code ??
    'cloudy'

  return {
    dt: new Date(entry.time).getTime(),
    temp: entry.data.instant.details.air_temperature,
    icon: symbolCodeToOwmIcon(symbolCode)
  }
}

// MET Norway (api.met.no) requires every client to send an identifying User-Agent - see
// https://api.met.no/doc/TermsOfService. No API key needed.
export async function fetchMetNoForecast(lat: number, lng: number): Promise<WeatherResponse> {
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lng}`

  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  if (!res.ok) {
    throw new Error(`met.no responded with ${res.status}`)
  }

  const parsed = locationforecastSchema.parse(await res.json())
  const [current, ...rest] = parsed.properties.timeseries

  return {
    current: toWeatherPoint(current),
    // met.no gives hourly resolution for ~48h and 6h resolution after that - cap it to keep the payload small.
    hourly: rest.slice(0, 48).map(toWeatherPoint)
  }
}
