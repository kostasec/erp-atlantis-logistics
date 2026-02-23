const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Invalid credentials
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validacija input-a
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Pronađi korisnika
    const userResult = await User.findByEmail(email);
    
    if (userResult.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = userResult.recordset[0];

    // Proveri password
    const isValidPassword = await User.verifyPassword(password, user.PasswordHash);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generiši JWT token
    const permissions = await User.getRolePermissions(user.Role);
    
    const tokenPayload = {
      userId: user.UserID,
      email: user.Email,
      role: user.Role,
      permissions: permissions
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });

    // Update last login
    await User.updateLastLogin(user.UserID);

    // Vrati response (bez password-a)
    res.json({
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        id: user.UserID,
        email: user.Email,
        firstName: user.FirstName,
        lastName: user.LastName,
        role: user.Role,
        permissions: permissions
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, manager, user]
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input or user already exists
 */
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Validacija
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Proveri da li user već postoji
    const existingUser = await User.findByEmail(email);
    
    if (existingUser.recordset.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Kreiraj novog korisnika
    const newUser = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role || 'user'
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser.recordset[0].UserID,
        email: newUser.recordset[0].Email,
        firstName: newUser.recordset[0].FirstName,
        lastName: newUser.recordset[0].LastName,
        role: newUser.recordset[0].Role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: Verify JWT token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 */
exports.verify = async (req, res) => {
  try {
    // req.user je već postavljen kroz authenticateToken middleware
    const userResult = await User.findById(req.user.userId);
    
    if (userResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = userResult.recordset[0];
    const permissions = await User.getRolePermissions(user.Role);

    res.json({
      success: true,
      user: {
        id: user.UserID,
        email: user.Email,
        firstName: user.FirstName,
        lastName: user.LastName,
        role: user.Role,
        permissions: permissions
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
exports.logout = async (req, res) => {
  // Za JWT, logout se uglavnom rešava na frontend-u brisanjem tokena
  // Ovde možemo dodati blacklist logiku ako je potrebno
  
  res.json({
    success: true,
    message: 'Logout successful'
  });
};