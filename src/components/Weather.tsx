import React, { useState, useEffect } from 'react'
import { format, isSameDay, differenceInMinutes, differenceInHours, getHours } from 'date-fns'
import { fi } from 'date-fns/locale'
import Axios from 'axios'
import { weatherApiKey } from '../../env'

function Weather({ data }: { data: any }) {
  const { current, hourly } = data

  return (
    <div className="fixed bottom-0 flex w-full gap-2 overflow-x-scroll border-t border-white bg-hsl-608 p-2">
      {[current, ...hourly].map((hour: any) => {
        const hourDate = new Date(hour.dt)
        const dayOfWeek = format(hourDate, 'EEEEE', { locale: fi })
        const timeFormat = isSameDay(hourDate, new Date()) ? 'HH' : `'${dayOfWeek}' HH`

        return (
          <div key={hour.dt} className="flex flex-col flex-nowrap">
            <span className="text-center">{format(hourDate, timeFormat, { locale: fi })}</span>
            <img
              className="-mx-3 -my-6 max-w-none flex-grow"
              src={`/open-weather-map-icons/${hour.weather.icon}_t@2x.png`}
            />
            <span className="mt-1 text-center text-xl">{Math.round(hour.temp - 273.16)}°</span>
          </div>
        )
      })}
    </div>
  )
}

export function WeatherProvider({ lat, lng }: { lat?: string | null; lng?: string | null }) {
  const [result, setData] = useState<{
    loading: boolean
    error?: string
    data: any
  }>({
    loading: true,
    error: undefined,
    data: undefined
  })

  useEffect(() => {
    function fecth() {
      Axios.get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat ?? '60.16952'}&lon=${lng ?? '24.93545'}&exclude=daily,minutely&appid=${weatherApiKey}`
      )
        .then((res) => {
          setData({ data: res.data, loading: false, error: undefined })
        })
        .catch(() => {
          setData({ error: 'Error in weather', loading: false, data: undefined })
        })
    }

    fecth()

    const interval = setInterval(fecth, 5 * 60 * 1000)

    return function cleanup() {
      clearInterval(interval)
    }
  }, [])

  const { loading, error, data } = result

  if (loading) return <div className="fixed bottom-0 w-full bg-hsl-608 p-2">Loading...</div>
  if (error) return <div className="fixed bottom-0 w-full bg-hsl-608 p-2">Error :(</div>

  data.current.dt *= 1000
  data.current.weather = data.current.weather[0]
  data.hourly = data.hourly.map((hour: any) => {
    hour.dt *= 1000
    hour.weather = hour.weather[0]
    return hour
  })

  data.hourly = data.hourly
    .filter((hour: any) => {
      // filter upcoming hours away if its closer than 50min away. We display current weather anyway
      return differenceInMinutes(new Date(hour.dt), new Date()) > 50
    })
    .filter((hour: any) => {
      // every second hour away if its night or if its more than 12 hours away
      const hourDate = new Date(hour.dt)
      const h = getHours(hourDate)

      if (differenceInHours(hourDate, new Date()) >= 12) {
        return h % 2 === 0
      } else {
        return h >= 7 || h % 2 === 0
      }
    })

  return <Weather data={data} />
}
