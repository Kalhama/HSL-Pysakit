import React, { useState, useEffect } from 'react'

export function Kitty() {
  // Show kitty randomily. Calculate if we should show the kitty every 60s

  const probability = 0.1
  const [visible, setVisible] = useState(Math.random() < probability)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(Math.random() < probability)
    }, 60 * 1000)
    return function cleanup() {
      clearInterval(timer)
    }
  }, [])

  if (visible) return <img src="/kitty.gif" className="fixed bottom-36 right-0 h-48" />
  else return null
}
