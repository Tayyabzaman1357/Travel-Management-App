import Wishlist from '../models/Wishlist.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { createError } from '../utils/ApiError.js'

const VALID_TYPES = ['hotel', 'flight', 'tour', 'destination', 'car', 'cruise']

// GET /api/wishlist (auth)
export const listWishlist = asyncHandler(async (req, res) => {
  const items = await Wishlist.find({ user: req.user._id }).sort({ savedAt: -1 })
  res.json({ success: true, count: items.length, data: items })
})

// POST /api/wishlist (auth) — { type, itemId, item }
export const addToWishlist = asyncHandler(async (req, res) => {
  const { type, itemId, item } = req.body
  if (!type || !itemId) throw createError(400, 'Type and itemId are required.')
  if (!VALID_TYPES.includes(type)) throw createError(400, `Type must be one of: ${VALID_TYPES.join(', ')}`)

  // Upsert on the unique (user, type, itemId) index
  const saved = await Wishlist.findOneAndUpdate(
    { user: req.user._id, type, itemId },
    { $set: { item: item || {}, savedAt: new Date() } },
    { new: true, upsert: true }
  )
  res.status(201).json({ success: true, data: saved })
})

// DELETE /api/wishlist/:id (auth)
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const entry = await Wishlist.findOne({ _id: req.params.id, user: req.user._id })
  if (!entry) throw createError(404, 'Wishlist item not found.')
  await entry.deleteOne()
  res.json({ success: true, message: 'Removed from wishlist.' })
})

// DELETE /api/wishlist/item/:type/:itemId (auth) — convenience delete by item
export const removeByItem = asyncHandler(async (req, res) => {
  const { type, itemId } = req.params
  await Wishlist.deleteOne({ user: req.user._id, type, itemId })
  res.json({ success: true, message: 'Removed from wishlist.' })
})
