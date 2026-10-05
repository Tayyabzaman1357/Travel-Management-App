import Review from '../models/Review.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { createError } from '../utils/ApiError.js'

// GET /api/reviews (public) — ?itemType=&itemId=&search=
export const listReviews = asyncHandler(async (req, res) => {
  const { itemType, itemId, search } = req.query
  const filter = {}
  if (itemType) filter.itemType = itemType
  if (itemId) filter.itemId = itemId
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { text: { $regex: search, $options: 'i' } },
      { userName: { $regex: search, $options: 'i' } },
    ]
  }
  const reviews = await Review.find(filter).sort({ createdAt: -1 })
  res.json({ success: true, count: reviews.length, data: reviews })
})

// GET /api/reviews/my (auth)
export const myReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json({ success: true, count: reviews.length, data: reviews })
})

// POST /api/reviews (auth)
export const createReview = asyncHandler(async (req, res) => {
  const { rating, title, text, itemType, itemId, itemName } = req.body
  if (!rating || !text) throw createError(400, 'Rating and review text are required.')
  if (Number(rating) < 1 || Number(rating) > 5) throw createError(400, 'Rating must be between 1 and 5.')

  const review = await Review.create({
    user: req.user._id,
    userName: req.user.name,
    rating: Number(rating),
    title: title || '',
    text,
    itemType: itemType || 'hotel',
    itemId: itemId || '',
    itemName: itemName || '',
  })
  res.status(201).json({ success: true, data: review })
})

// PUT /api/reviews/:id (owner or admin)
export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
  if (!review) throw createError(404, 'Review not found.')
  const isOwner = String(review.user) === String(req.user._id)
  if (!isOwner && req.user.role !== 'admin') throw createError(403, 'Access denied — this is not your review.')

  if (req.body.rating !== undefined) {
    if (Number(req.body.rating) < 1 || Number(req.body.rating) > 5) throw createError(400, 'Rating must be between 1 and 5.')
    review.rating = Number(req.body.rating)
  }
  if (req.body.title !== undefined) review.title = req.body.title
  if (req.body.text !== undefined) review.text = req.body.text
  await review.save()
  res.json({ success: true, data: review })
})

// DELETE /api/reviews/:id (owner or admin)
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
  if (!review) throw createError(404, 'Review not found.')
  const isOwner = String(review.user) === String(req.user._id)
  if (!isOwner && req.user.role !== 'admin') throw createError(403, 'Access denied — this is not your review.')
  await review.deleteOne()
  res.json({ success: true, message: 'Review removed.' })
})
