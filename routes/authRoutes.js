const express = require('express');
const { login, register, recoverPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

// Login route
router.post('/login', login, (req, res) => {
  // Redirect to the dashboard after successful login
  res.redirect('/dashboard');
});

// Signup route
router.get('/signup', (req, res) => {
  // Handle GET request for signup route (can be an empty function or return an appropriate response)
  res.send('GET request for signup route');
});

router.post('/signup', register);

// Password Recovery route
router.post('/recover-password', recoverPassword);

// Password Reset routes
router.get('/reset-password/:token', resetPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;