import { Router } from 'express'
import {
  listHotels, getHotel, createHotel, updateHotel, deleteHotel,
} from '../controllers/hotelController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.route('/').get(listHotels).post(protect, adminOnly, createHotel)
router.route('/:id').get(getHotel).put(protect, adminOnly, updateHotel).delete(protect, adminOnly, deleteHotel)

export default router
