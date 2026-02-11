const express = require('express');
const { initDatabase } = require('./config/database');
const authRoutes = require('./routes/auth');
const todosRoutes = require('./routes/todos');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

/**
 * Create and configure Express application
 */
function createApp() {
  const app = express();
  
  // Initialize database
  initDatabase();
  
  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });
  
  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/todos', todosRoutes);
  
  // 404 handler
  app.use(notFoundHandler);
  
  // Error handler (must be last)
  app.use(errorHandler);
  
  return app;
}

module.exports = createApp;
