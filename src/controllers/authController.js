const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

/**
 * Generate JWT token
 */
function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

/**
 * Register new user
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    
    // Create user
    const user = await User.create({ email, password, name });
    
    // Generate token
    const token = generateToken(user);
    
    res.status(201).json({
      user,
      token
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Login user
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findByEmail(email);
    
    if (!user) {
      const error = new Error('Invalid email or password');
      error.code = 'INVALID_CREDENTIALS';
      error.statusCode = 401;
      throw error;
    }
    
    // Verify password
    const isValid = await User.verifyPassword(password, user.password);
    
    if (!isValid) {
      const error = new Error('Invalid email or password');
      error.code = 'INVALID_CREDENTIALS';
      error.statusCode = 401;
      throw error;
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    // Generate token
    const token = generateToken(userWithoutPassword);
    
    res.status(200).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login
};
