const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const verifyToken = require('../middleware/auth');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/me', verifyToken, userController.getCurrentUser);

module.exports = router;
