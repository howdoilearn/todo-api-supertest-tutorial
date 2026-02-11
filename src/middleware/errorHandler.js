/**
 * Error handling middleware
 * Centralized error handler for consistent error responses
 */
function errorHandler(err, req, res, next) {
  // Log error for debugging
  console.error('Error:', err);
  
  // Default error response
  const statusCode = err.statusCode || 500;
  const errorResponse = {
    error: {
      message: err.message || 'Internal server error',
      code: err.code || 'INTERNAL_ERROR'
    }
  };
  
  // Add validation details if present
  if (err.details) {
    errorResponse.error.details = err.details;
  }
  
  res.status(statusCode).json(errorResponse);
}

/**
 * 404 Not Found handler
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      message: 'Resource not found',
      code: 'NOT_FOUND'
    }
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
