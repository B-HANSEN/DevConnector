import 'dotenv/config'
import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import connectDB from './config/db.js'
import usersRouter from './routes/api/users.js'
import authRouter from './routes/api/auth.js'
import profileRouter from './routes/api/profile.js'
import postsRouter from './routes/api/posts.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()

// connect db
connectDB()

// init middleware for body parser; allows to get data in req.body
app.use(express.json())

// define routes
app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)
app.use('/api/profile', profileRouter)
app.use('/api/posts', postsRouter)

// serve static assets in production (local only — Vercel serves the frontend separately)
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  app.use(express.static('client/dist'))
  app.get('/{*path}', (req, res) => {
    res.sendFile(resolve(__dirname, 'client', 'dist', 'index.html'))
  })
}

// local dev server
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5001
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}

export default app
