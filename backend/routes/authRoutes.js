const express = require('express');
const AuthController = require('../controllers/authController');
const Middleware = require('../middleware/middleware');

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', Middleware.verifyToken, AuthController.logout);
router.post('/forgot-password', AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

module.exports = router;