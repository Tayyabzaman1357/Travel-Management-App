import { Router } from 'express'
import {
  checkout, myPayments, getAllPayments, getPayment, updatePayment, deletePayment,
} from '../controllers/paymentController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/my', myPayments)
router.get('/', adminOnly, getAllPayments)
router.post('/', checkout)
router.route('/:id').get(getPayment).put(adminOnly, updatePayment).delete(adminOnly, deletePayment)

export default router
