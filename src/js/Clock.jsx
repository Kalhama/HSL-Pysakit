import React, { useState, useEffect } from 'react'
import moment from 'moment'

export function Clock() {
    const [date, setDate] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setDate(new Date()), 1000)
        return function cleanup() {
            clearInterval(timer)
        }
    })

    return (
        <div id="clock">
            <h2>{moment(date).format('D. MMMM[ta] - HH:mm')}</h2>
        </div>
    )
}
