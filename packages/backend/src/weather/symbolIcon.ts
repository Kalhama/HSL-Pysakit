// MET Norway's Locationforecast API returns Yr weather symbol codes (e.g. "partlycloudy_day"),
// while the frontend already ships OpenWeatherMap icon assets (public/open-weather-map-icons).
// Map the former onto the latter so we don't need to source and ship a new icon set.
export function symbolCodeToOwmIcon(symbolCode: string): string {
  const isNight = symbolCode.endsWith('_night')
  const suffix = isNight ? 'n' : 'd'
  const base = symbolCode.replace(/_(day|night|polartwilight)$/, '')

  if (base.includes('thunder')) return `11${suffix}`
  if (base.includes('snow')) return `13${suffix}`
  if (base.includes('sleet')) return `13${suffix}`
  if (base.includes('rainshowers')) return `09${suffix}`
  if (base.includes('rain')) return `10${suffix}`
  if (base === 'fog') return `50${suffix}`
  if (base === 'cloudy') return `04${suffix}`
  if (base === 'partlycloudy') return `03${suffix}`
  if (base === 'fair') return `02${suffix}`
  if (base === 'clearsky') return `01${suffix}`

  return `03${suffix}`
}
