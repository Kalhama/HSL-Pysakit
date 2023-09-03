import React from 'react'
import { Clock } from './Clock'
import { HSLProvider } from './HSL'
import { WeatherProvider } from './Weather'
import { Kitty } from './Kitty'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { HSL_API_KEY } from '../../env'
import { useParams, useSearchParams } from 'react-router-dom'

const client = new ApolloClient({
    uri: `https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql?digitransit-subscription-key=${HSL_API_KEY}`,
    cache: new InMemoryCache()
})

export const Stop = () => {
    const { stopid } = useParams()
    const params = useSearchParams()
    const lat = params[0].get('lat')
    const lng = params[0].get('lng')

    return (
        <div>
            <Clock />
            <ApolloProvider client={client}>
                <HSLProvider stopid={stopid ?? ''} />
            </ApolloProvider>

            <WeatherProvider lat={lat} lng={lng} />
            <Kitty />
        </div>

    )
}
