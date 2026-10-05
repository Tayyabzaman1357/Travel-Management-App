import Destination from '../models/Destination.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { createError } from '../utils/ApiError.js'

// GET /api/destinations — ?tag=&region=&featured=&search=
export const listDestinations = asyncHandler(async (req, res) => {
  const { tag, region, featured, search } = req.query
  const filter = {}
  if (tag) filter.tags = tag
  if (region) filter.region = new RegExp(region.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
  if (featured === 'true') filter.featured = true
  if (search) filter.$text = { $search: search }

  const destinations = await Destination.find(filter).sort({ featured: -1, reviews: -1 })
  res.json({ success: true, count: destinations.length, data: destinations })
})

// GET /api/destinations/:id
export const getDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id)
  if (!destination) throw createError(404, 'Destination not found.')
  res.json({ success: true, data: destination })
})

// POST /api/destinations (admin)
export const createDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.create(req.body)
  res.status(201).json({ success: true, data: destination })
})

// PUT /api/destinations/:id (admin)
export const updateDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!destination) throw createError(404, 'Destination not found.')
  res.json({ success: true, data: destination })
})

// DELETE /api/destinations/:id (admin)
export const deleteDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findByIdAndDelete(req.params.id)
  if (!destination) throw createError(404, 'Destination not found.')
  res.json({ success: true, message: 'Destination removed.' })
})
