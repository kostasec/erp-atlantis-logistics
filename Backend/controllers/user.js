const { sql, getPool } = require('../util/db');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

/**
 * Get single user by ID (self or admin)
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Only allow admin or the same user
    const requester = req.user;
    if (!requester || (parseInt(id) !== requester.userId && requester.role !== 'admin')) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const result = await User.findById(parseInt(id));
    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const u = result.recordset[0];
    res.json({
      success: true,
      data: {
        id: u.UserID,
        email: u.Email,
        firstName: u.FirstName,
        lastName: u.LastName,
        role: u.Role,
        isActive: u.IsActive
      }
    });
  } catch (error) {
    console.error('Error fetching user by id:', error);
    res.status(500).json({ success: false, message: 'Error fetching user' });
  }
};

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create new user
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 */
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user already exists
    const existingUserResult = await User.findByEmail(email);
    if (existingUserResult.recordset.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const newUserResult = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || 'employee'
    });

    const newUser = newUserResult.recordset[0];

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: newUser.UserID,
        email: newUser.Email,
        firstName: newUser.FirstName,
        lastName: newUser.LastName,
        role: newUser.Role
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user'
    });
  }
};

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role, isActive } = req.body;

    // Validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and email are required'
      });
    }

    const updatedUser = await User.updateById(id, {
      firstName,
      lastName,
      email,
      role,
      isActive
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user'
    });
  }
};

/**
 * @swagger
 * /users/{id}/password:
 *   put:
 *     summary: Update user password
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 */
const updateUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    const pool = await getPool();
    await pool.request()
      .input('UserID', sql.Int, id)
      .input('PasswordHash', sql.NVarChar, hashedPassword)
      .query(`
        UPDATE Users 
        SET PasswordHash = @PasswordHash 
        WHERE UserID = @UserID
      `);

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating password'
    });
  }
};

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user (deactivate)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Don't allow deleting self
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const pool = await getPool();
    await pool.request()
      .input('UserID', sql.Int, id)
      .query(`
        UPDATE Users 
        SET IsActive = 0 
        WHERE UserID = @UserID
      `);

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
};

/**
 * Generate temporary password for user
 */
const generateTempPassword = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Generate random 12-character password
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let tempPassword = '';
    for (let i = 0; i < 12; i++) {
      tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Hash and update password
    const hashedPassword = await bcrypt.hash(tempPassword, 12);
    
    const pool = await getPool();
    await pool.request()
      .input('UserID', sql.Int, id)
      .input('PasswordHash', sql.VarChar(255), hashedPassword)
      .query(`
        UPDATE Users 
        SET PasswordHash = @PasswordHash, LastLoginAt = NULL
        WHERE UserID = @UserID
      `);

    res.json({
      success: true,
      message: 'Temporary password generated successfully',
      data: {
        temporaryPassword: tempPassword
      }
    });
  } catch (error) {
    console.error('Error generating temporary password:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating temporary password'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  generateTempPassword
};