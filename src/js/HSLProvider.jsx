import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { HSL } from './HSL'
import * as moment from 'moment'

const STOP_ID = 2323251

const STOP_DATA = gql`
    {
        stop(id: "HSL:${STOP_ID}") {
            name
            stoptimesWithoutPatterns(numberOfDepartures: 6) {
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

export function HSLProvider() {
    const { loading, error, data } = useQuery(STOP_DATA, { pollInterval: 10 * 1000 })

    if (loading) return <div id="hsl">Loading...</div>
    if (error) return <div id="hsl">Error :(</div>

    const stoptimesWithoutPatterns = data.stop.stoptimesWithoutPatterns
        .map((stoptime) => {
            return {
                realtime: stoptime.realtime,
                shortName: stoptime.trip.route.shortName,
                headsign: stoptime.headsign,
                realtimeDeparture: (stoptime.realtimeDeparture + stoptime.serviceDay) * 1000
            }
        })
        .filter((stoptime) => moment(stoptime.realtimeDeparture).diff(moment(), 'minutes') < 60)

    return (
        <div id="hsl">
            <HSL stoptimesWithoutPatterns={stoptimesWithoutPatterns} stopName={data.stop.name} />
        </div>
    )
}
