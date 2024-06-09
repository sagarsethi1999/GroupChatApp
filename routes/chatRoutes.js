const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const verifyToken = require('../middleware/auth');

router.post('/send-message', verifyToken, chatController.sendMessage);

module.exports = router;