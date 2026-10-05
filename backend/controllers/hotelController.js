import Hotel from '../models/Hotel.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { createError } from '../utils/ApiError.js'

// GET /api/hotels — ?dest=&maxPrice=&minRating=&featured=&search=
export const listHotels = asyncHandler(async (req, res) => {
  const { dest, maxPrice, minRating, featured, search } = req.query
  const filter = {}
  if (dest) {
    const rx = new RegExp(dest.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [{ city: rx }, { country: rx }, { name: rx }]
  }
  if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) }
  if (minRating) filter.rating = { ...filter.rating, $gte: Number(minRating) }
  if (featured === 'true') filter.featured = true
  if (search) filter.$text = { $search: search }

  const hotels = await Hotel.find(filter).sort({ featured: -1, reviews: -1 })
  res.json({ success: true, count: hotels.length, data: hotels })
})

// GET /api/hotels/:id
export const getHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id)
  if (!hotel) throw createError(404, 'Hotel not found.')
  res.json({ success: true, data: hotel })
})

// POST /api/hotels (admin)
export const createHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.create(req.body)
  res.status(201).json({ success: true, data: hotel })
})

// PUT /api/hotels/:id (admin)
export const updateHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!hotel) throw createError(404, 'Hotel not found.')
  res.json({ success: true, data: hotel })
})

// DELETE /api/hotels/:id (admin)
export const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findByIdAndDelete(req.params.id)
  if (!hotel) throw createError(404, 'Hotel not found.')
  res.json({ success: true, message: 'Hotel removed.' })
})
