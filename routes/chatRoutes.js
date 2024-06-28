const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const verifyToken = require('../middleware/auth');

router.post('/send', verifyToken, chatController.sendMessage);
router.get('/messages', verifyToken, chatController.getMessages);
router.post('/clear', verifyToken, chatController.clearMessages);

module.exports = router;