import multer from 'multer'
import { createError } from '../utils/ApiError.js'

// Keep files in memory so they can be streamed to Cloudinary (or written
// locally) inside the controller.
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(createError(400, 'Only image files are allowed (jpg, png, webp, gif).'))
  }
}

export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
}).single('image')

export const uploadImages = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).array('images', 10)
