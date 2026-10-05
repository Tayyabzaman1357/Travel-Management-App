import { Router } from 'express'
import {
  listFlights, getFlight, createFlight, updateFlight, deleteFlight,
} from '../controllers/flightController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.route('/').get(listFlights).post(protect, adminOnly, createFlight)
router.route('/:id').get(getFlight).put(protect, adminOnly, updateFlight).delete(protect, adminOnly, deleteFlight)

export default router
