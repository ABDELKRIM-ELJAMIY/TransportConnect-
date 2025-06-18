const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { validateRegister, validateLogin, authRateLimiter } = require('../middlewares/validation');

router.post('/register', authRateLimiter, validateRegister, register);
router.post('/login', authRateLimiter, validateLogin, login);

router.get('/me', protect, getMe);

module.exports = router;
