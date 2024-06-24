const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const verifyToken = require('../middleware/auth');

router.post('/', verifyToken, groupController.createGroup);
router.post('/join', verifyToken, groupController.joinGroup);
router.get('/', verifyToken, groupController.getGroups);
router.get('/members', verifyToken, groupController.getGroupMembers);

module.exports = router;
