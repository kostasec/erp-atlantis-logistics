const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/login', authController.login);
router.post('/register', authController.register);

// Protected routes
router.get('/verify', authenticateToken, authController.verify);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;