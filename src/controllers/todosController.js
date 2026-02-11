const Todo = require('../models/Todo');

/**
 * Create new todo
 * POST /api/todos
 */
async function createTodo(req, res, next) {
  try {
    const { title, description, completed, dueDate } = req.body;
    const userId = req.user.id;
    
    const todo = await Todo.create({
      userId,
      title,
      description,
      completed,
      dueDate
    });
    
    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * Get all todos for current user
 * GET /api/todos
 */
async function getTodos(req, res, next) {
  try {
    const userId = req.user.id;
    const todos = await Todo.findByUserId(userId);
    
    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
}

/**
 * Get single todo by ID
 * GET /api/todos/:id
 */
async function getTodoById(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const todo = await Todo.findById(id);
    
    if (!todo) {
      const error = new Error('Todo not found');
      error.code = 'TODO_NOT_FOUND';
      error.statusCode = 404;
      throw error;
    }
    
    // Check ownership
    if (todo.userId !== userId) {
      const error = new Error('Access denied');
      error.code = 'FORBIDDEN';
      error.statusCode = 403;
      throw error;
    }
    
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * Update todo
 * PUT /api/todos/:id
 */
async function updateTodo(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;
    
    // Check if todo exists and belongs to user
    const existingTodo = await Todo.findById(id);
    
    if (!existingTodo) {
      const error = new Error('Todo not found');
      error.code = 'TODO_NOT_FOUND';
      error.statusCode = 404;
      throw error;
    }
    
    if (existingTodo.userId !== userId) {
      const error = new Error('Access denied');
      error.code = 'FORBIDDEN';
      error.statusCode = 403;
      throw error;
    }
    
    // Update todo
    const updatedTodo = await Todo.update(id, updates);
    
    res.status(200).json(updatedTodo);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete todo
 * DELETE /api/todos/:id
 */
async function deleteTodo(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if todo exists and belongs to user
    const existingTodo = await Todo.findById(id);
    
    if (!existingTodo) {
      const error = new Error('Todo not found');
      error.code = 'TODO_NOT_FOUND';
      error.statusCode = 404;
      throw error;
    }
    
    if (existingTodo.userId !== userId) {
      const error = new Error('Access denied');
      error.code = 'FORBIDDEN';
      error.statusCode = 403;
      throw error;
    }
    
    // Delete todo
    await Todo.delete(id);
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo
};
