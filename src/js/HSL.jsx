import React from 'react'
import * as moment from 'moment'

export function HSL({ stoptimesWithoutPatterns, stopName }) {
    return (
        <div>
            <h2>{stopName}</h2>
            <table>
                <tbody>
                    {stoptimesWithoutPatterns.map((stoptime) => {
                        return (
                            <tr key={Math.random()}>
                                <td>{moment(stoptime.realtimeDeparture).diff(moment(), 'minutes')} min</td>
                                <td className="shortName">{stoptime.shortName}</td>
                                <td>{stoptime.headsign}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
