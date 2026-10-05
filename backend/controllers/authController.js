import crypto from 'node:crypto'
import User from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { createError } from '../utils/ApiError.js'
import { generateToken } from '../utils/generateToken.js'

const sendToken = (user, res, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    token: generateToken(user._id),
    user,
  })
}

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    throw createError(400, 'Name, email and password are required.')
  }
  if (String(password).length < 6) {
    throw createError(400, 'Password must be at least 6 characters.')
  }

  const exists = await User.findOne({ email: email.toLowerCase() })
  if (exists) throw createError(409, 'An account with this email already exists. Please sign in.')

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    provider: 'password',
    photoURL: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 60) + 1}`,
  })

  sendToken(user, res, 201)
})

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) throw createError(400, 'Email and password are required.')

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
  if (!user) throw createError(401, 'No account found with this email address.')

  const ok = await user.matchPassword(password)
  if (!ok) throw createError(401, 'Incorrect password. Please try again.')

  sendToken(user, res)
})

// POST /api/auth/google — demo Google sign-in (no Firebase, no OAuth round trip)
export const googleSignIn = asyncHandler(async (req, res) => {
  const name = (req.body && req.body.name) || 'Google Traveler'
  const email = (req.body && req.body.email) || `google.traveler${Math.floor(Math.random() * 9000) + 1000}@gmail.com`

  let user = await User.findOne({ email: email.toLowerCase(), provider: 'google' })
  if (!user) {
    user = await User.create({
      name,
      email: email.toLowerCase(),
      password: crypto.randomBytes(24).toString('hex'),
      provider: 'google',
      photoURL: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 60) + 1}`,
    })
  }
  sendToken(user, res)
})

// POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  if (!email) throw createError(400, 'Email is required.')

  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) throw createError(404, 'No account found with this email address.')

  const resetToken = crypto.randomBytes(32).toString('hex')
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000 // 1 hour
  await user.save()

  // In production, email `${CLIENT_URL}/reset-password?token=${resetToken}` here.
  res.json({
    success: true,
    message: 'If that email is registered, a password reset link has been sent.',
  })
})

// POST /api/auth/reset-password  body: { token, password }
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body
  if (!token || !password) throw createError(400, 'Token and new password are required.')
  if (String(password).length < 6) throw createError(400, 'Password must be at least 6 characters.')

  const hashed = crypto.createHash('sha256').update(token).digest('hex')
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: Date.now() },
  })
  if (!user) throw createError(400, 'Invalid or expired reset token.')

  user.password = password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save()

  res.json({ success: true, message: 'Password updated. Please sign in with your new password.' })
})

// GET /api/auth/me
export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user })
})

// PUT /api/auth/update-profile  (name, phone, address, photoURL)
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address, photoURL } = req.body
  const user = req.user

  if (name !== undefined) user.name = String(name).trim()
  if (phone !== undefined) user.phone = phone
  if (address !== undefined) user.address = address
  if (photoURL !== undefined) user.photoURL = photoURL

  await user.save()
  res.json({ success: true, user })
})
