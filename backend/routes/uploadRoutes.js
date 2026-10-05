import { Router } from 'express'
import { uploadSingle, uploadMultiple } from '../controllers/uploadController.js'
import { protect } from '../middleware/auth.js'
import { uploadImage, uploadImages } from '../middleware/upload.js'

const router = Router()

router.use(protect)

router.post('/', uploadImage, uploadSingle)
router.post('/multiple', uploadImages, uploadMultiple)

export default router
