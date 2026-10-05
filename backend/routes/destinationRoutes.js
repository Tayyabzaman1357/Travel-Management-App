import { Router } from 'express'
import {
  listDestinations, getDestination, createDestination, updateDestination, deleteDestination,
} from '../controllers/destinationController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.route('/').get(listDestinations).post(protect, adminOnly, createDestination)
router.route('/:id').get(getDestination).put(protect, adminOnly, updateDestination).delete(protect, adminOnly, deleteDestination)

export default router
