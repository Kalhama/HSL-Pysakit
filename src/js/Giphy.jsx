import React, { useEffect, useState } from 'react'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { giphyApiKey } from '../../env'

const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function Giphy({ images }) {
    const [gif, selectGif] = useState()

    useEffect(() => {
        const selectRandomGif = () => {
            const i = random(0, images.length - 1)
            selectGif(images[i].images.original_mp4.mp4)
        }

        selectRandomGif()

        const timer = setInterval(selectRandomGif, 10 * 1000)
        return function cleanup() {
            clearInterval(timer)
        }
    }, [])

    if (!gif) {
        console.error('no gifs')
        return null
    }
    return <video autoPlay={true} loop={true} src={gif} />
}

export function GiphyProvider({ search }) {
    const [offset, setOffset] = useState(0)
    const [result, setData] = useState({
        loading: true,
        error: undefined,
        data: undefined
    })

    useEffect(() => {
        function fetch() {
            const gf = new GiphyFetch(giphyApiKey)

            const options = { type: 'gifs', limit: 50, offset }

            const gfPromise = search ? gf.search(search, options) : gf.search('meme', options)

            gfPromise
                .then((res) => {
                    if (res.pagination.total_count + 50 > offset) {
                        setOffset(0)
                    } else {
                        setOffset(offset + 50)
                    }
                    setData({ data: res.data, loading: false, error: undefined })
                })
                .catch((error) => {
                    setData({ error })
                })
        }

        fetch()

        const interval = setInterval(fetch, 5 * 60 * 1000)

        return function cleanup() {
            clearInterval(interval)
        }
    }, [])

    const { loading, error, data } = result

    if (loading) return null
    if (error) return null

    return <Giphy images={data} />
}
