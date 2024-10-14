import React, { useState } from 'react'
import { Marker, Popup, MapContainer, TileLayer } from 'react-leaflet'

import stopsurl from '../HSL_pysakit_kevat2018.geojson?url'
import { type LatLngTuple } from 'leaflet'
import { Loader2 } from 'lucide-react'

interface IStop {
  type: 'Feature'
  id: number
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
  properties: {
    FID: number
    SOLMUTUNNU: string
    LYHYTTUNNU: string
    SOLMUTYYPP: string
    X: number
    Y: number
    PROJ_X: number
    PROJ_Y: number
    NIMI1: string
    NAMN1: string
    NIMI2: string
    NAMN2: string
    REI_VOIM: number
    AIK_VOIM: number
    VERKKO: number
    PYSAKKITYY: string
  }
}

export const StopPicker = () => {
  const [fields, setFields] = useState<IStop[]>([])
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    setLoading(true)
    fetch(stopsurl)
      .then(async (response) => await response.json())
      .then((res) => res.features as IStop[])
      .then((stops) => {
        console.log(stops)
        setFields(stops)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const StopMarker = ({ stop }: { stop: IStop }) => {
    const position = [stop.geometry.coordinates[1], stop.geometry.coordinates[0]] as LatLngTuple
    const { SOLMUTUNNU, LYHYTTUNNU, NIMI1, NIMI2 } = stop.properties
    return (
      <Marker position={position}>
        <Popup>
          <a href={`/stop/${SOLMUTUNNU}?lat=${position[0]}&lng=${position[1]}`}>
            {LYHYTTUNNU} - {NIMI1} {NIMI2}
          </a>
        </Popup>
      </Marker>
    )
  }

  return (
    <div>
      {loading && (
        <div className="absolute top-0 z-50 flex h-full w-full items-center justify-center bg-[#474747aa] text-xl">
          <span>Loading</span>
          <Loader2 className="ml-1 h-4 w-4 animate-spin" />
        </div>
      )}
      <MapContainer className="h-screen" center={[60.16952, 24.93545]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {fields.map((el) => (
          <StopMarker key={el.properties.SOLMUTUNNU} stop={el} />
        ))}
      </MapContainer>
    </div>
  )
}
