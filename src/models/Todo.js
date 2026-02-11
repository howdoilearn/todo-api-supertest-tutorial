const { getDatabase } = require('../config/database');

/**
 * Todo Model
 * Handles all database operations for todos
 */
class Todo {
  /**
   * Create a new todo
   * @param {Object} todoData - Todo data
   * @param {number} todoData.userId - User ID (owner)
   * @param {string} todoData.title - Todo title
   * @param {string} [todoData.description] - Todo description
   * @param {boolean} [todoData.completed=false] - Completion status
   * @param {string} [todoData.dueDate] - Due date (ISO format)
   * @returns {Object} Created todo
   */
  static create({ userId, title, description, completed = false, dueDate }) {
    const db = getDatabase();
    
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO todos (userId, title, description, completed, dueDate, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      userId,
      title,
      description || null,
      completed ? 1 : 0,
      dueDate || null,
      now,
      now
    );
    
    return this.findById(result.lastInsertRowid);
  }

  /**
   * Find todo by ID
   * @param {number} id - Todo ID
   * @returns {Object|null} Todo object or null
   */
  static findById(id) {
    const db = getDatabase();
    
    const stmt = db.prepare(`
      SELECT 
        id,
        userId,
        title,
        description,
        completed,
        dueDate,
        createdAt,
        updatedAt
      FROM todos
      WHERE id = ?
    `);
    
    const todo = stmt.get(id);
    
    if (!todo) {
      return null;
    }
    
    // Convert completed from integer to boolean
    return {
      ...todo,
      completed: Boolean(todo.completed)
    };
  }

  /**
   * Find all todos for a user
   * @param {number} userId - User ID
   * @returns {Array} Array of todos
   */
  static findByUserId(userId) {
    const db = getDatabase();
    
    const stmt = db.prepare(`
      SELECT 
        id,
        userId,
        title,
        description,
        completed,
        dueDate,
        createdAt,
        updatedAt
      FROM todos
      WHERE userId = ?
      ORDER BY createdAt DESC
    `);
    
    const todos = stmt.all(userId);
    
    // Convert completed from integer to boolean
    return todos.map(todo => ({
      ...todo,
      completed: Boolean(todo.completed)
    }));
  }

  /**
   * Update todo
   * @param {number} id - Todo ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated todo or null
   */
  static update(id, updates) {
    const db = getDatabase();
    
    const allowedFields = ['title', 'description', 'completed', 'dueDate'];
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      return this.findById(id);
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => {
      // Convert boolean to integer for completed field
      if (field === 'completed') {
        return updates[field] ? 1 : 0;
      }
      return updates[field];
    });
    
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      UPDATE todos
      SET ${setClause}, updatedAt = ?
      WHERE id = ?
    `);
    
    const result = stmt.run(...values, now, id);
    
    if (result.changes === 0) {
      return null;
    }
    
    return this.findById(id);
  }

  /**
   * Delete todo
   * @param {number} id - Todo ID
   * @returns {boolean} True if deleted
   */
  static delete(id) {
    const db = getDatabase();
    
    const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
    const result = stmt.run(id);
    
    return result.changes > 0;
  }

  /**
   * Check if todo belongs to user
   * @param {number} todoId - Todo ID
   * @param {number} userId - User ID
   * @returns {boolean} True if todo belongs to user
   */
  static belongsToUser(todoId, userId) {
    const db = getDatabase();
    
    const stmt = db.prepare(`
      SELECT id FROM todos WHERE id = ? AND userId = ?
    `);
    
    const result = stmt.get(todoId, userId);
    
    return Boolean(result);
  }

  /**
   * Get todos count for a user
   * @param {number} userId - User ID
   * @returns {Object} Count object with total and completed
   */
  static getCountByUserId(userId) {
    const db = getDatabase();
    
    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(completed) as completed
      FROM todos
      WHERE userId = ?
    `);
    
    const result = stmt.get(userId);
    
    return {
      total: result.total || 0,
      completed: result.completed || 0,
      pending: (result.total || 0) - (result.completed || 0)
    };
  }
}

module.exports = Todo;
