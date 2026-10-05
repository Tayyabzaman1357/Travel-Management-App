import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import { notFound, errorHandler } from './middleware/error.js'
import routes from './routes/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

// Local uploads (used when Cloudinary is not configured)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'travel-booking-api', time: new Date().toISOString() })
})

// ── API routes ──────────────────────────────────────────────────────────────
app.use('/api', routes)

// ── 404 + error handling ────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

// ── Boot ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n✈️  Travel Booking API running on http://localhost:${PORT}`)
      console.log(`   Frontend origin: ${process.env.CLIENT_URL || 'http://localhost:5173'}\n`)
    })
  })
  .catch((err) => {
    console.error('❌ Failed to start server:', err.message)
    console.error('   Check that MONGODB_URI is set in backend/.env (see .env.example).')
    process.exit(1)
  })
