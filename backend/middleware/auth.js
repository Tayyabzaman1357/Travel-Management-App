import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { createError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

/**
 * Verifies the Bearer JWT and attaches the authenticated user to req.user.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token
  const header = req.headers.authorization
  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1]
  }

  if (!token) {
    throw createError(401, 'Not authorized — please sign in to continue.')
  }

  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    throw createError(401, 'Session expired — please sign in again.')
  }

  const user = await User.findById(decoded.id)
  if (!user) {
    throw createError(401, 'Account no longer exists — please sign up again.')
  }

  req.user = user
  next()
})

/**
 * Restricts a route to one or more roles. Use after `protect`.
 * authorize('admin') → admins only. authorize('admin', 'user') → any signed-in user.
 */
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(createError(401, 'Not authorized — please sign in to continue.'))
  }
  if (!roles.includes(req.user.role)) {
    return next(createError(403, `Access denied — this action requires the ${roles.join(' or ')} role.`))
  }
  next()
}

export const adminOnly = authorize('admin')
