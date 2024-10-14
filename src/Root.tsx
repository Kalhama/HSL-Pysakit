import './style/style.scss'
import React from 'react'
import moment from 'moment'
import { StopPicker } from './app/page'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Stop } from './app/stop/[id]/page'

moment.locale('fi')

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<StopPicker />} />
        <Route path="/stop/:stopid" element={<Stop />} />
      </Routes>
    </BrowserRouter>
  )
}
const container = document.getElementById('root')
if (!container) throw new Error('Cound not find a root element')
const root = createRoot(container)
root.render(<App />)
