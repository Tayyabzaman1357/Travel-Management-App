import { Router } from 'express'
import { listUsers, getUser, updateUser, deleteUser } from '../controllers/userController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.use(protect, adminOnly)

router.route('/').get(listUsers)
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)

export default router
