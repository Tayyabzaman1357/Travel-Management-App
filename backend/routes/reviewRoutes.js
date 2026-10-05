import { Router } from 'express'
import {
  listReviews, myReviews, createReview, updateReview, deleteReview,
} from '../controllers/reviewController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.get('/', listReviews)
router.get('/my', protect, myReviews)
router.post('/', protect, createReview)
router.put('/:id', protect, updateReview)
router.delete('/:id', protect, deleteReview)

export default router
