import Booking from '../models/Booking.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { createError } from '../utils/ApiError.js'

const makeReference = () => {
  const rand = () => Math.random().toString(36).slice(2, 4).toUpperCase()
  return `WL-${Math.floor(1000 + Math.random() * 9000)}-${rand()}${rand()[0]}`
}

// POST /api/bookings (auth)
export const createBooking = asyncHandler(async (req, res) => {
  const { type, itemId, itemName, image, date, endDate, guests, rooms, total, currency, paymentMethod, travelers, seats, contact } = req.body

  if (!type || !itemName) throw createError(400, 'Booking type and item name are required.')
  if (!['flight', 'hotel', 'tour', 'car', 'cruise', 'insurance'].includes(type)) {
    throw createError(400, 'Invalid booking type.')
  }

  const booking = await Booking.create({
    user: req.user._id,
    type,
    itemId: itemId || '',
    itemName,
    image: image || '',
    reference: makeReference(),
    date: date || '',
    endDate: endDate || '',
    guests: Number(guests) || 1,
    rooms: Number(rooms) || 1,
    total: Number(total) || 0,
    currency: currency || 'USD',
    status: 'confirmed',
    paymentMethod: paymentMethod || 'Card',
    travelers: Array.isArray(travelers) ? travelers : [],
    seats: Array.isArray(seats) ? seats : [],
    contact: contact || {},
  })

  res.status(201).json({ success: true, data: booking })
})

// GET /api/bookings/my (auth)
export const myBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json({ success: true, count: bookings.length, data: bookings })
})

// GET /api/bookings (admin) — optional ?status=&type=&search=
export const getAllBookings = asyncHandler(async (req, res) => {
  const { status, type, search } = req.query
  const filter = {}
  if (status) filter.status = status
  if (type) filter.type = type
  if (search) filter.itemName = { $regex: search, $options: 'i' }

  const bookings = await Booking.find(filter).sort({ createdAt: -1 })
  res.json({ success: true, count: bookings.length, data: bookings })
})

// GET /api/bookings/:id (owner or admin)
export const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
  if (!booking) throw createError(404, 'Booking not found.')
  const isOwner = String(booking.user) === String(req.user._id)
  if (!isOwner && req.user.role !== 'admin') throw createError(403, 'Access denied — this is not your booking.')
  res.json({ success: true, data: booking })
})

// PUT /api/bookings/:id (admin full update; owner may cancel)
export const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
  if (!booking) throw createError(404, 'Booking not found.')

  const isOwner = String(booking.user) === String(req.user._id)
  if (!isOwner && req.user.role !== 'admin') throw createError(403, 'Access denied.')

  if (isOwner && req.user.role !== 'admin') {
    // Users may only cancel their own bookings
    if (req.body.status && req.body.status !== 'cancelled') {
      throw createError(403, 'Users can only cancel their bookings.')
    }
    booking.status = 'cancelled'
  } else {
    Object.assign(booking, req.body)
  }
  await booking.save()
  res.json({ success: true, data: booking })
})

// DELETE /api/bookings/:id (owner or admin)
export const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
  if (!booking) throw createError(404, 'Booking not found.')
  const isOwner = String(booking.user) === String(req.user._id)
  if (!isOwner && req.user.role !== 'admin') throw createError(403, 'Access denied — this is not your booking.')
  await booking.deleteOne()
  res.json({ success: true, message: 'Booking removed.' })
})
