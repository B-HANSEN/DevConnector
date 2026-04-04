import 'dotenv/config'
import { Hono } from 'hono'
import { serve, getRequestListener } from '@hono/node-server'
import connectDB from './config/db.js'
import usersRouter from './routes/api/users.js'
import authRouter from './routes/api/auth.js'
import profileRouter from './routes/api/profile.js'
import postsRouter from './routes/api/posts.js'

connectDB()

const app = new Hono()

app.route('/api/users', usersRouter)
app.route('/api/auth', authRouter)
app.route('/api/profile', profileRouter)
app.route('/api/posts', postsRouter)

// local dev server
if (!process.env.VERCEL) {
  const PORT = Number(process.env.PORT ?? 5001)
  serve({ fetch: app.fetch, port: PORT }, () => {
    console.log(`Server started on port ${PORT}`)
  })
}

export default getRequestListener(app.fetch)
