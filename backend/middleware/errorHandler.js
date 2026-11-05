/**
 * 404 Not Found Middleware
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found.`,
  });
}

/**
 * Centralized Global Error Handler
 */
export function errorHandler(err, req, res, _next) {
  const isProduction = process.env.NODE_ENV === 'production';
  const statusCode = err.statusCode || (res.statusCode !== 200 && res.statusCode !== 201 ? res.statusCode : 500);

  // Log error in server logs
  console.error(`[Error] ${req.method} ${req.originalUrl} -`, err.message);
  if (!isProduction && err.stack) {
    console.error(err.stack);
  }

  // Handle specific MySQL errors safely
  if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR') {
    return res.status(503).json({
      success: false,
      message: 'Database service is currently unavailable. Please try again shortly.',
      ...(isProduction ? {} : { debug: err.message }),
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.isOperational ? err.message : (isProduction ? 'An unexpected server error occurred.' : err.message),
    ...(err.errors ? { errors: err.errors } : {}),
    ...(isProduction ? {} : { stack: err.stack }),
  });
}
