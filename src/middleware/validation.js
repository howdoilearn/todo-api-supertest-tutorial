const { validationResult } = require('express-validator');

/**
 * Validation result handler
 * Checks for validation errors and returns 400 if any exist
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const details = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details
      }
    });
  }
  
  next();
}

module.exports = handleValidationErrors;
