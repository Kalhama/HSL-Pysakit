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
    <div className="border-b border-b-white font-medium">
      <h2 className="py-4 text-center text-3xl">{moment(date).format('D. MMMM[ta] - HH:mm')}</h2>
    </div>
  )
}
