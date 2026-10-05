import { ApiError } from '../utils/ApiError.js'

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}

export const errorHandler = (err, req, res, next) => {
  let { statusCode = 500, message = 'Server error' } = err

  // Mongoose: bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 404
    message = `Resource not found (invalid id: ${err.value})`
  }

  // Mongoose: validation error
  if (err.name === 'ValidationError') {
    statusCode = 400
    const details = Object.values(err.errors).map((e) => e.message)
    message = details[0] || 'Validation failed'
    err.details = details
  }

  // Mongoose: duplicate key
  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyPattern || {})[0] || 'value'
    message = `An account with this ${field} already exists.`
  }

  // Multer / file errors
  if (err.name === 'MulterError') {
    statusCode = 400
    message = `Upload error: ${err.message}`
  }

  const isDev = process.env.NODE_ENV !== 'production'
  console.error(`[${new Date().toISOString()}] ${statusCode} — ${message}`)
  if (isDev && err.stack) console.error(err.stack)

  res.status(statusCode).json({
    success: false,
    message,
    details: err.details || undefined,
    stack: isDev ? err.stack : undefined,
  })
}
