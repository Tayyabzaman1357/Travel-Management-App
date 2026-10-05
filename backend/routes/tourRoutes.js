import { Router } from 'express'
import {
  listTours, getTour, createTour, updateTour, deleteTour,
} from '../controllers/tourController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.route('/').get(listTours).post(protect, adminOnly, createTour)
router.route('/:id').get(getTour).put(protect, adminOnly, updateTour).delete(protect, adminOnly, deleteTour)

export default router
