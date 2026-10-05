import { Router } from 'express'
import authRoutes from './authRoutes.js'
import userRoutes from './userRoutes.js'
import hotelRoutes from './hotelRoutes.js'
import flightRoutes from './flightRoutes.js'
import destinationRoutes from './destinationRoutes.js'
import tourRoutes from './tourRoutes.js'
import bookingRoutes from './bookingRoutes.js'
import reviewRoutes from './reviewRoutes.js'
import wishlistRoutes from './wishlistRoutes.js'
import paymentRoutes from './paymentRoutes.js'
import uploadRoutes from './uploadRoutes.js'

const router = Router()

router.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'Travel Booking API',
    version: '1.0.0',
    endpoints: [
      '/api/auth/register', '/api/auth/login', '/api/auth/google', '/api/auth/forgot-password', '/api/auth/reset-password',
      '/api/auth/me', '/api/auth/update-profile',
      '/api/users', '/api/hotels', '/api/flights', '/api/destinations', '/api/tours',
      '/api/bookings', '/api/reviews', '/api/wishlist', '/api/payments', '/api/upload',
      '/api/health',
    ],
  })
})

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/hotels', hotelRoutes)
router.use('/flights', flightRoutes)
router.use('/destinations', destinationRoutes)
router.use('/tours', tourRoutes)
router.use('/bookings', bookingRoutes)
router.use('/reviews', reviewRoutes)
router.use('/wishlist', wishlistRoutes)
router.use('/payments', paymentRoutes)
router.use('/upload', uploadRoutes)

export default router
