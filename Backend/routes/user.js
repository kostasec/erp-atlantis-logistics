const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// GET /users - List all users (Admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), userController.getAllUsers);

// GET /users/:id - Get single user (self or admin)
router.get('/:id', authenticateToken, userController.getUserById);

// POST /users - Create new user (Admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), userController.createUser);

// PUT /users/:id - Update user (Admin only)
router.put('/:id', authenticateToken, authorizeRoles('admin'), userController.updateUser);

// PUT /users/:id/password - Update user password (Admin only)
router.put('/:id/password', authenticateToken, authorizeRoles('admin'), userController.updateUserPassword);

// DELETE /users/:id - Deactivate user (Admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), userController.deleteUser);

// POST /users/:id/temp-password - Generate temporary password (Admin only)
router.post('/:id/temp-password', authenticateToken, authorizeRoles('admin'), userController.generateTempPassword);

module.exports = router;