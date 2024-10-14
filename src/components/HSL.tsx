import React from 'react'
import moment from 'moment'
import { useQuery, gql } from '@apollo/client'
import { GiphyProvider } from './Giphy'

function HSL({ stoptimesWithoutPatterns, stopName }: { stoptimesWithoutPatterns: any; stopName: string }) {
  if (stoptimesWithoutPatterns.length === 0) {
    return (
      <>
        <h2>No buses leaving next 60min</h2>
        <GiphyProvider />
      </>
    )
  }

  return (
    <div>
      {stoptimesWithoutPatterns.map((stoptime: any) => {
        const departureIn = moment(stoptime.realtimeDeparture).subtract(20, 'seconds').diff(moment(), 'minutes')

        let displayDepTime

        if (departureIn <= 0) {
          displayDepTime = 'Nyt'
        } else if (departureIn <= 25) {
          displayDepTime = `${departureIn} min`
        } else {
          displayDepTime = moment(stoptime.realtimeDeparture).format('HH:mm')
        }

        return (
          <div key={Math.random()} className="flex items-center gap-2 border-b border-hsl-300 py-2">
            <span className="text-2xl font-bold">{stoptime.shortName}</span>
            <span className="text-xl">{stoptime.headsign}</span>
            <div className="ml-auto text-nowrap rounded-lg bg-white px-4 py-2 text-2xl font-bold text-hsl-608">
              {displayDepTime}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const STOP_DATA = (stopid: string) => gql`
    {
        stop(id: "HSL:${stopid}") {
            name
            stoptimesWithoutPatterns(numberOfDepartures: 8) {
                realtimeDeparture
                realtime
                headsign
                serviceDay
                trip {
                    route {
                        shortName
                    }
                }
            }
        }
    }
`

export function HSLProvider({ stopid }: { stopid: string }) {
  const { loading, error, data } = useQuery(STOP_DATA(stopid), { pollInterval: 10 * 1000 })

  const stoptimesWithoutPatterns = data?.stop?.stoptimesWithoutPatterns?.map((stoptime: any) => {
    return {
      realtime: stoptime.realtime,
      shortName: stoptime.trip.route.shortName,
      headsign: stoptime.headsign,
      realtimeDeparture: (stoptime.realtimeDeparture + stoptime.serviceDay) * 1000
    }
  })

  return (
    <div className="px-4 pb-48" id="hsl">
      {loading ? (
        <h2>Loading</h2>
      ) : error ? (
        <>
          <h2>Error with HSL API :(</h2>
          <GiphyProvider search={'error'} />
        </>
      ) : !data.stop ? (
        <>
          <h2>No bus stop data</h2>
          <GiphyProvider search={'404'} />
        </>
      ) : (
        <HSL stoptimesWithoutPatterns={stoptimesWithoutPatterns} stopName={data.stop.name} />
      )}
    </div>
  )
}
