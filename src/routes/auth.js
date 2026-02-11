const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const handleValidationErrors = require('../middleware/validation');

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post(
  '/register',
  [
    body('email')
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('name')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Name is required')
  ],
  handleValidationErrors,
  register
);

/**
 * POST /api/auth/login
 * Login user
 */
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  handleValidationErrors,
  login
);

module.exports = router;
