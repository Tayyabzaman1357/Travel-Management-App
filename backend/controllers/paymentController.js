import Payment from '../models/Payment.js'
import Booking from '../models/Booking.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { createError } from '../utils/ApiError.js'

const makeReference = (prefix = 'PAY') =>
  `${prefix}-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`

/**
 * POST /api/payments (auth)
 * Simulated checkout: validates the amount, creates the Booking (confirmed)
 * and records the Payment (paid). In production you would verify with a real
 * payment provider (Stripe / PayPal / JazzCash) here.
 */
export const checkout = asyncHandler(async (req, res) => {
  const {
    type, itemId, itemName, image, date, endDate, guests, rooms,
    amount, currency, method, cardLast4, email, phone, travelers, seats, contact,
  } = req.body

  if (!type || !itemName || amount === undefined) {
    throw createError(400, 'type, itemName and amount are required.')
  }
  if (Number(amount) <= 0) throw createError(400, 'Amount must be greater than zero.')

  const booking = await Booking.create({
    user: req.user._id,
    type,
    itemId: itemId || '',
    itemName,
    image: image || '',
    reference: makeReference('WL'),
    date: date || '',
    endDate: endDate || '',
    guests: Number(guests) || 1,
    rooms: Number(rooms) || 1,
    total: Number(amount),
    currency: currency || 'USD',
    status: 'confirmed',
    paymentMethod: method ? String(method).charAt(0).toUpperCase() + String(method).slice(1) : 'Card',
    travelers: Array.isArray(travelers) ? travelers : [],
    seats: Array.isArray(seats) ? seats : [],
    contact: contact || { email, phone },
  })

  const payment = await Payment.create({
    user: req.user._id,
    booking: booking._id,
    reference: makeReference('PAY'),
    amount: Number(amount),
    currency: currency || 'USD',
    method: method || 'card',
    status: 'paid',
    cardLast4: cardLast4 || '',
    email: email || '',
    phone: phone || '',
    paidAt: new Date(),
  })

  res.status(201).json({ success: true, data: { payment, booking } })
})

// GET /api/payments/my (auth)
export const myPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json({ success: true, count: payments.length, data: payments })
})

// GET /api/payments (admin)
export const getAllPayments = asyncHandler(async (req, res) => {
  const { status, method } = req.query
  const filter = {}
  if (status) filter.status = status
  if (method) filter.method = method
  const payments = await Payment.find(filter).sort({ createdAt: -1 })
  res.json({ success: true, count: payments.length, data: payments })
})

// GET /api/payments/:id (owner or admin)
export const getPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
  if (!payment) throw createError(404, 'Payment not found.')
  const isOwner = String(payment.user) === String(req.user._id)
  if (!isOwner && req.user.role !== 'admin') throw createError(403, 'Access denied.')
  res.json({ success: true, data: payment })
})

// PUT /api/payments/:id (admin) — status changes (refund etc.)
export const updatePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
  if (!payment) throw createError(404, 'Payment not found.')
  if (req.body.status !== undefined) {
    if (!['pending', 'paid', 'failed', 'refunded'].includes(req.body.status)) {
      throw createError(400, 'Invalid payment status.')
    }
    payment.status = req.body.status
  }
  await payment.save()
  res.json({ success: true, data: payment })
})

// DELETE /api/payments/:id (admin)
export const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.id)
  if (!payment) throw createError(404, 'Payment not found.')
  res.json({ success: true, message: 'Payment removed.' })
})
