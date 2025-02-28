import React, { useState, useEffect, useMemo } from 'react'
import { Marker, Popup, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { divIcon, point } from 'leaflet'

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
  const [currentZoom, setCurrentZoom] = useState(13)
  const [mapBounds, setMapBounds] = useState<[[number, number], [number, number]] | null>(null)

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

  // Component to track and update zoom level and bounds
  const MapStateUpdater = () => {
    const map = useMapEvents({
      zoomend: () => {
        setCurrentZoom(map.getZoom())
        const bounds = map.getBounds()
        setMapBounds([
          [bounds.getSouth(), bounds.getWest()],
          [bounds.getNorth(), bounds.getEast()]
        ])
      },
      moveend: () => {
        const bounds = map.getBounds()
        setMapBounds([
          [bounds.getSouth(), bounds.getWest()],
          [bounds.getNorth(), bounds.getEast()]
        ])
      },
      load: () => {
        setCurrentZoom(map.getZoom())
        const bounds = map.getBounds()
        setMapBounds([
          [bounds.getSouth(), bounds.getWest()],
          [bounds.getNorth(), bounds.getEast()]
        ])
      }
    })
    return null
  }


  const shouldRenderMarker = (zoom: number) => {
    return zoom >= 15 
  }


  const visibleStops = useMemo(() => {
    if (!mapBounds) return fields
    
    return fields.filter(stop => {
      const lat = stop.geometry.coordinates[1]
      const lng = stop.geometry.coordinates[0]
      return (
        lat >= mapBounds[0][0] && 
        lat <= mapBounds[1][0] && 
        lng >= mapBounds[0][1] && 
        lng <= mapBounds[1][1]
      )
    })
  }, [fields, mapBounds])

  // Custom cluster icon
  const createClusterCustomIcon = (cluster: any) => {
    const count = cluster.getChildCount()
    let size = 40
    let className = 'bg-hsl-608 text-white'
    
    if (count > 50) {
      size = 60
      className = 'bg-hsl-608 text-white font-bold'
    } else if (count > 20) {
      size = 50
      className = 'bg-hsl-608 text-white'
    }
    
    return divIcon({
      html: `<div class="cluster-icon ${className} flex items-center justify-center rounded-full">${count}</div>`,
      className: 'custom-marker-cluster',
      iconSize: point(size, size)
    })
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
        <MapStateUpdater />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        

        {!shouldRenderMarker(currentZoom) && (
          <MarkerClusterGroup 
            zoomToBoundsOnClick={false}
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={80} // Adjust clustering radius
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
          >
            {visibleStops.map((el) => (
              <StopMarker key={el.properties.SOLMUTUNNU} stop={el} />
            ))}
          </MarkerClusterGroup>
        )}
        

        {shouldRenderMarker(currentZoom) && 
          visibleStops.map((el) => (
            <StopMarker key={el.properties.SOLMUTUNNU} stop={el} />
          ))
        }

   
      </MapContainer>
    </div>
  )
}
