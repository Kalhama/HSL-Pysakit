import React, { Fragment } from 'react'
import moment from 'moment'
import { useState, useEffect } from 'react'
import * as axios from 'axios'

function Weather({ data }) {
    const { current, hourly } = data
    return (
        <Fragment>
            <Hour time={'NYT'} icon={current.weather.icon} temp={current.temp} />
            {hourly.map((hour) => {
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

function Hour({ time, icon, temp }) {
    return (
        <div className="hour">
            <span>{time}</span>
            <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} />
            <span className="temperature">{Math.round(temp - 273.16)}°</span>
        </div>
    )
}

export function WeatherProvider() {
    const [result, setData] = useState({
        loading: true,
        error: undefined,
        data: undefined
    })

    useEffect(() => {
        function fecth() {
            const LAT = '60.169903'
            const LON = '24.730005'

            const APIKEY = '15fe2abc4ca97e419a302be45816f900'
            axios
                .get(
                    `https://api.openweathermap.org/data/2.5/onecall?lat=${LAT}&lon=${LON}&exclude=daily,minutely&appid=${APIKEY}`
                )
                .then((res) => setData({ data: res.data, loading: false, error: undefined }))
                .catch((error) => setData({ error }))
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
    data.hourly = data.hourly.map((hour) => {
        hour.dt *= 1000
        hour.weather = hour.weather[0]
        return hour
    })

    data.hourly = data.hourly
        .filter((hour) => {
            // filter upcoming hours away if its closer than 50min away. We display current weather anyway
            return moment(hour.dt).diff(moment(), 'minutes') > 50
        })
        .filter((hour) => {
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
