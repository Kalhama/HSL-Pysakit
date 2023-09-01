import React, { Fragment } from 'react'
import moment from 'moment'
import { useState, useEffect } from 'react'
import Axios from 'axios'
import { weatherApiKey, weatherLocation } from '../../env'

function Weather({ data }: {data: any}) {
    const { current, hourly } = data
    return (
        <Fragment>
            <Hour time={'NYT'} icon={current.weather.icon} temp={current.temp} />
            {hourly.map((hour: any) => {
                const weekdayletter = moment(hour.dt).format('dd')[0].toUpperCase()
                const format = moment(hour.dt).day() === moment().day() ? 'HH' : `[${weekdayletter} ]HH`
                return (
                    <Hour
                        key={hour.dt}
                        time={moment(hour.dt).format(format)}
                        icon={hour.weather.icon}
                        temp={hour.temp}
                    />
                )
            })}
        </Fragment>
    )
}

function Hour({ time, icon, temp }: {time: string, icon: string, temp: number}) {
    return (
        <div className="hour">
            <span>{time}</span>
            <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} />
            <span className="temperature">{Math.round(temp - 273.16)}°</span>
        </div>
    )
}

export function WeatherProvider() {
    const [result, setData] = useState<{
        loading: boolean,
        error?: string,
        data: any
    }>({
        loading: true,
        error: undefined,
        data: undefined
    })

    useEffect(() => {
        function fecth() {
            Axios
                .get(
                    `https://api.openweathermap.org/data/2.5/onecall?lat=${weatherLocation.lat}&lon=${weatherLocation.lon}&exclude=daily,minutely&appid=${weatherApiKey}`
                )
                .then((res) => setData({ data: res.data, loading: false, error: undefined }))
                .catch((error) => setData({ error: 'Error in weather', loading: false, data: undefined }))
        }

        fecth()

        const interval = setInterval(fecth, 5 * 60 * 1000)

        return function cleanup() {
            clearInterval(interval)
        }
    }, [])

    const { loading, error, data } = result

    if (loading) return <div id="weather">Loading...</div>
    if (error) return <div id="weather">Error :(</div>

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
            return moment(hour.dt).diff(moment(), 'minutes') > 50
        })
        .filter((hour: any) => {
            // every second hour away if its night or if its more than 12 hours away
            const h = moment(hour.dt).hour()

            if (moment(hour.dt).diff(moment(), 'hours') >= 12) {
                return h % 2 === 0
            } else {
                return h >= 7 || h % 2 === 0
            }
        })

    return (
        <div id="weather">
            <Weather data={data} />
        </div>
    )
}
