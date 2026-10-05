import Tour from '../models/Tour.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { createError } from '../utils/ApiError.js'

// GET /api/tours — ?type=&dest=&maxPrice=&search=
export const listTours = asyncHandler(async (req, res) => {
  const { type, dest, maxPrice, search } = req.query
  const filter = {}
  if (type) filter.type = type
  if (dest) {
    const rx = new RegExp(dest.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [{ name: rx }, { destination: rx }]
  }
  if (maxPrice) filter.price = { $lte: Number(maxPrice) }
  if (search) filter.$text = { $search: search }

  const tours = await Tour.find(filter).sort({ reviews: -1 })
  res.json({ success: true, count: tours.length, data: tours })
})

// GET /api/tours/:id
export const getTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id)
  if (!tour) throw createError(404, 'Tour not found.')
  res.json({ success: true, data: tour })
})

// POST /api/tours (admin)
export const createTour = asyncHandler(async (req, res) => {
  const tour = await Tour.create(req.body)
  res.status(201).json({ success: true, data: tour })
})

// PUT /api/tours/:id (admin)
export const updateTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!tour) throw createError(404, 'Tour not found.')
  res.json({ success: true, data: tour })
})

// DELETE /api/tours/:id (admin)
export const deleteTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id)
  if (!tour) throw createError(404, 'Tour not found.')
  res.json({ success: true, message: 'Tour removed.' })
})
