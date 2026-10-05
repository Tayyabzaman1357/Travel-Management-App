import { Router } from 'express'
import {
  createBooking, myBookings, getAllBookings, getBooking, updateBooking, deleteBooking,
} from '../controllers/bookingController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/my', myBookings)
router.get('/', adminOnly, getAllBookings)
router.post('/', createBooking)
router.route('/:id').get(getBooking).put(updateBooking).delete(deleteBooking)

export default router
