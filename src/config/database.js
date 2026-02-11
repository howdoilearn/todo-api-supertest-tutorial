const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Database configuration
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/todos.db');
const SCHEMA_PATH = path.join(__dirname, '../db/schema.sql');

let db = null;

/**
 * Initialize database connection
 * Creates database file and tables if they don't exist
 */
function initDatabase() {
  if (db) {
    return db;
  }

  // Ensure data directory exists
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Create database connection
  db = new Database(DB_PATH);
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Read and execute schema
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  db.exec(schema);

  console.log(`Database initialized at: ${DB_PATH}`);
  
  return db;
}

/**
 * Get database instance
 * Initializes if not already initialized
 */
function getDatabase() {
  if (!db) {
    return initDatabase();
  }
  return db;
}

/**
 * Close database connection
 * Used for cleanup in tests and shutdown
 */
function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    console.log('Database connection closed');
  }
}

/**
 * Reset database (for testing)
 * Drops all tables and recreates schema
 */
function resetDatabase() {
  const database = getDatabase();
  
  // Drop tables
  database.exec('DROP TABLE IF EXISTS todos');
  database.exec('DROP TABLE IF EXISTS users');
  
  // Recreate schema
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  database.exec(schema);
  
  console.log('Database reset complete');
}

module.exports = {
  initDatabase,
  getDatabase,
  closeDatabase,
  resetDatabase
};
