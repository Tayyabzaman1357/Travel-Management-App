import { uploadImageBuffer } from '../config/cloudinary.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { createError } from '../utils/ApiError.js'

// POST /api/upload (auth) — single image, multipart field "image"
export const uploadSingle = asyncHandler(async (req, res) => {
  if (!req.file) throw createError(400, 'No image file provided (field name: image).')
  const result = await uploadImageBuffer(req.file.buffer, { folder: 'travel-booking' })
  res.status(201).json({ success: true, url: result.url, public_id: result.public_id })
})

// POST /api/upload/multiple (auth) — multiple images, field "images"
export const uploadMultiple = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw createError(400, 'No image files provided (field name: images).')
  }
  const results = await Promise.all(
    req.files.map((f) => uploadImageBuffer(f.buffer, { folder: 'travel-booking' }))
  )
  res.status(201).json({ success: true, urls: results.map((r) => r.url) })
})
