import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { fi } from 'date-fns/locale'

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
      <h2 className="py-4 text-center text-3xl">{format(date, "d. MMMM - HH:mm", { locale: fi })}</h2>
    </div>
  )
}
