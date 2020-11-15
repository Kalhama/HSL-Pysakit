import React from 'react'
import ReactDOM from 'react-dom'
import { HSLProvider } from './HSLProvider'
import { Clock } from './Clock'
import { ApolloProvider } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { WeatherProvider } from './WeatherProvider'
import * as moment from 'moment'
import { Kitty } from './Kitty'

moment.locale('fi')

const client = new ApolloClient({
    uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
    cache: new InMemoryCache()
})

export default class App extends React.Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <Clock />
                <HSLProvider />
                <WeatherProvider />
                <Kitty />
            </ApolloProvider>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'))
