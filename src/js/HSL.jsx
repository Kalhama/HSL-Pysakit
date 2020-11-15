import React from 'react'
import moment from 'moment'

export function HSL({ stoptimesWithoutPatterns }) {
    return (
        <table>
            <tbody>
                {stoptimesWithoutPatterns.map((stoptime) => {
                    const departureIn = moment(stoptime.realtimeDeparture).diff(moment(), 'minutes')

                    const displayDepTime = departureIn === 0 ? 'Nyt' : `${departureIn} min`
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
