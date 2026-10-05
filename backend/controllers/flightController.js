import Flight from '../models/Flight.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { createError } from '../utils/ApiError.js'

// GET /api/flights — ?from=&to=&maxPrice=&stops=&date=&search=
export const listFlights = asyncHandler(async (req, res) => {
  const { from, to, fromCode, toCode, maxPrice, stops, date, search } = req.query
  const filter = {}
  if (from) filter.from = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
  if (to) filter.to = new RegExp(to.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
  if (fromCode) filter.fromCode = String(fromCode).toUpperCase()
  if (toCode) filter.toCode = String(toCode).toUpperCase()
  if (maxPrice) filter.price = { $lte: Number(maxPrice) }
  if (stops !== undefined && stops !== '') filter.stops = { $lte: Number(stops) }
  if (date) filter.date = date
  if (search) filter.$text = { $search: search }

  const flights = await Flight.find(filter).sort({ price: 1 })
  res.json({ success: true, count: flights.length, data: flights })
})

// GET /api/flights/:id
export const getFlight = asyncHandler(async (req, res) => {
  const flight = await Flight.findById(req.params.id)
  if (!flight) throw createError(404, 'Flight not found.')
  res.json({ success: true, data: flight })
})

// POST /api/flights (admin)
export const createFlight = asyncHandler(async (req, res) => {
  const flight = await Flight.create(req.body)
  res.status(201).json({ success: true, data: flight })
})

// PUT /api/flights/:id (admin)
export const updateFlight = asyncHandler(async (req, res) => {
  const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!flight) throw createError(404, 'Flight not found.')
  res.json({ success: true, data: flight })
})

// DELETE /api/flights/:id (admin)
export const deleteFlight = asyncHandler(async (req, res) => {
  const flight = await Flight.findByIdAndDelete(req.params.id)
  if (!flight) throw createError(404, 'Flight not found.')
  res.json({ success: true, message: 'Flight removed.' })
})
