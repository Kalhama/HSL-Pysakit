import React, { Fragment } from 'react'
import moment from 'moment'
import { useQuery, gql } from '@apollo/client'
import { GiphyProvider } from './Giphy'
import { hslBusStopId } from '../../env'

function HSL({ stoptimesWithoutPatterns, stopName }: {stoptimesWithoutPatterns: any, stopName: string}) {
    if (stoptimesWithoutPatterns.length === 0) {
        return (
            <Fragment>
                <h2>No buses leaving next 60min</h2>
                <GiphyProvider />
            </Fragment>
        )
    }

    return (
        <table>
            <tbody>
                {stoptimesWithoutPatterns.map((stoptime: any) => {
                    const departureIn = moment(stoptime.realtimeDeparture)
                        .subtract(20, 'seconds')
                        .diff(moment(), 'minutes')

                    let displayDepTime

                    if (departureIn <= 0) {
                        displayDepTime = 'Nyt'
                    } else if (departureIn <= 25) {
                        displayDepTime = `${departureIn} min`
                    } else {
                        displayDepTime = moment(stoptime.realtimeDeparture).format('HH:mm')
                    }

                    return (
                        <tr key={Math.random()}>
                            <td className="shortName">{stoptime.shortName}</td>
                            <td>{stoptime.headsign}</td>
                            <td className="departure">
                                <div>{displayDepTime}</div>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

const STOP_DATA = gql`
    {
        stop(id: "HSL:${hslBusStopId}") {
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

export function HSLProvider() {
    const { loading, error, data } = useQuery(STOP_DATA, { pollInterval: 10 * 1000 })

    if (loading)
        return (
            <div id="hsl">
                <h2>Loading...</h2>
            </div>
        )
    if (error)
        return (
            <div id="hsl">
                <h2>Error with HSL API :(</h2>
                <GiphyProvider search={'error'} />
            </div>
        )

    const stoptimesWithoutPatterns = data.stop.stoptimesWithoutPatterns.map((stoptime: any) => {
        return {
            realtime: stoptime.realtime,
            shortName: stoptime.trip.route.shortName,
            headsign: stoptime.headsign,
            realtimeDeparture: (stoptime.realtimeDeparture + stoptime.serviceDay) * 1000
        }
    })

    return (
        <div id="hsl">
            <HSL stoptimesWithoutPatterns={stoptimesWithoutPatterns} stopName={data.stop.name} />
        </div>
    )
}
