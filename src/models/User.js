const { getDatabase } = require('../config/database');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

/**
 * User Model
 * Handles all database operations for users
 */
class User {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @param {string} userData.email - User email (unique)
   * @param {string} userData.password - Plain text password (will be hashed)
   * @param {string} userData.name - User name
   * @returns {Object} Created user (without password)
   */
  static async create({ email, password, name }) {
    const db = getDatabase();
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    const now = new Date().toISOString();
    
    try {
      const stmt = db.prepare(`
        INSERT INTO users (email, password, name, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(email, hashedPassword, name, now, now);
      
      // Return user without password
      return {
        id: result.lastInsertRowid,
        email,
        name,
        createdAt: now,
        updatedAt: now
      };
    } catch (error) {
      // Check for unique constraint violation
      if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes('UNIQUE')) {
        const err = new Error('Email already exists');
        err.code = 'EMAIL_EXISTS';
        err.statusCode = 409;
        throw err;
      }
      throw error;
    }
  }

  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Object|null} User object (without password) or null
   */
  static findById(id) {
    const db = getDatabase();
    
    const stmt = db.prepare(`
      SELECT id, email, name, createdAt, updatedAt
      FROM users
      WHERE id = ?
    `);
    
    return stmt.get(id) || null;
  }

  /**
   * Find user by email (includes password for authentication)
   * @param {string} email - User email
   * @returns {Object|null} User object (with password) or null
   */
  static findByEmail(email) {
    const db = getDatabase();
    
    const stmt = db.prepare(`
      SELECT id, email, password, name, createdAt, updatedAt
      FROM users
      WHERE email = ?
    `);
    
    return stmt.get(email) || null;
  }

  /**
   * Verify user password
   * @param {string} plainPassword - Plain text password
   * @param {string} hashedPassword - Hashed password from database
   * @returns {Promise<boolean>} True if password matches
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated user or null
   */
  static async update(id, updates) {
    const db = getDatabase();
    
    const allowedFields = ['name', 'email'];
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      return this.findById(id);
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);
    
    const now = new Date().toISOString();
    
    try {
      const stmt = db.prepare(`
        UPDATE users
        SET ${setClause}, updatedAt = ?
        WHERE id = ?
      `);
      
      const result = stmt.run(...values, now, id);
      
      if (result.changes === 0) {
        return null;
      }
      
      return this.findById(id);
    } catch (error) {
      // Check for unique constraint violation
      if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes('UNIQUE')) {
        const err = new Error('Email already exists');
        err.code = 'EMAIL_EXISTS';
        err.statusCode = 409;
        throw err;
      }
      throw error;
    }
  }

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {boolean} True if deleted
   */
  static delete(id) {
    const db = getDatabase();
    
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    
    return result.changes > 0;
  }

  /**
   * Get all users (without passwords)
   * @returns {Array} Array of users
   */
  static findAll() {
    const db = getDatabase();
    
    const stmt = db.prepare(`
      SELECT id, email, name, createdAt, updatedAt
      FROM users
      ORDER BY createdAt DESC
    `);
    
    return stmt.all();
  }
}

module.exports = User;
