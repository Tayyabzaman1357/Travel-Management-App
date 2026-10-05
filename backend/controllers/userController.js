import User from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { createError } from '../utils/ApiError.js'

// GET /api/users (admin) — optional ?search=&role=
export const listUsers = asyncHandler(async (req, res) => {
  const { search, role } = req.query
  const filter = {}
  if (role) filter.role = role
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ]
  }
  const users = await User.find(filter).sort({ createdAt: -1 })
  res.json({ success: true, count: users.length, data: users })
})

// GET /api/users/:id (admin)
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) throw createError(404, 'User not found.')
  res.json({ success: true, data: user })
})

// PUT /api/users/:id (admin) — name, role, phone, address
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) throw createError(404, 'User not found.')

  const { name, role, phone, address, photoURL } = req.body
  if (name !== undefined) user.name = String(name).trim()
  if (phone !== undefined) user.phone = phone
  if (address !== undefined) user.address = address
  if (photoURL !== undefined) user.photoURL = photoURL
  if (role !== undefined) {
    if (!['user', 'admin'].includes(role)) throw createError(400, 'Role must be "user" or "admin".')
    user.role = role
  }
  await user.save()
  res.json({ success: true, data: user })
})

// DELETE /api/users/:id (admin)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) throw createError(404, 'User not found.')
  if (user.role === 'admin') throw createError(403, 'You cannot delete an administrator account.')
  await user.deleteOne()
  res.json({ success: true, message: 'User removed.' })
})
