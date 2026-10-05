/**
 * Wraps an async controller so thrown errors are forwarded to the
 * Express error handler instead of crashing the process.
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)
