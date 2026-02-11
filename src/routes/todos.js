const express = require('express');
const { body, param } = require('express-validator');
const {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo
} = require('../controllers/todosController');
const authenticate = require('../middleware/authenticate');
const handleValidationErrors = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * POST /api/todos
 * Create a new todo
 */
router.post(
  '/',
  [
    body('title')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title is required and must be 1-200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters'),
    body('completed')
      .optional()
      .isBoolean()
      .withMessage('Completed must be a boolean'),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Due date must be a valid ISO 8601 date')
  ],
  handleValidationErrors,
  createTodo
);

/**
 * GET /api/todos
 * Get all todos for current user
 */
router.get('/', getTodos);

/**
 * GET /api/todos/:id
 * Get a specific todo
 */
router.get(
  '/:id',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Invalid todo ID')
  ],
  handleValidationErrors,
  getTodoById
);

/**
 * PUT /api/todos/:id
 * Update a todo
 */
router.put(
  '/:id',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Invalid todo ID'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be 1-200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters'),
    body('completed')
      .optional()
      .isBoolean()
      .withMessage('Completed must be a boolean'),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Due date must be a valid ISO 8601 date')
  ],
  handleValidationErrors,
  updateTodo
);

/**
 * DELETE /api/todos/:id
 * Delete a todo
 */
router.delete(
  '/:id',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Invalid todo ID')
  ],
  handleValidationErrors,
  deleteTodo
);

module.exports = router;
