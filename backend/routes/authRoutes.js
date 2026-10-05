import { Router } from 'express'
import {
  register, login, googleSignIn, forgotPassword, resetPassword, me, updateProfile,
} from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/google', googleSignIn)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

router.get('/me', protect, me)
router.put('/update-profile', protect, updateProfile)

export default router
