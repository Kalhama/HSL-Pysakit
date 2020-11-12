import React, { useState, useEffect } from 'react'
import * as axios from 'axios'

import { Weather } from './Weather'

export function WeatherProvider() {
    const [result, setData] = useState({
        loading: true,
        error: undefined,
        data: undefined
    })

    useEffect(() => {
        function fecth() {
            const CITYID = '660158'
            const APIKEY = '15fe2abc4ca97e419a302be45816f900'
            axios
                .get(`https://pro.openweathermap.org/data/2.5/forecast/hourly?id=${CITYID}&appid=${APIKEY})`)
                .then((data) => setData({ data, loading: false, error: undefined }))
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

    return <Weather data={data} />
}
