import React, { Fragment } from 'react'
import moment from 'moment'

export function Weather({ data }) {
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
