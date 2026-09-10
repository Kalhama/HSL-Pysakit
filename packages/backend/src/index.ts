import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { weatherRoute } from './weather/route.js'

const app = new Hono()

app.use('*', cors({ origin: process.env.CORS_ORIGIN ?? '*' }))
app.route('/', weatherRoute)

const port = Number(process.env.PORT ?? 3001)

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Weather backend listening on http://localhost:${info.port}`)
})
