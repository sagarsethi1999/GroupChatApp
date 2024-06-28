const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const verifyToken = require('../middleware/auth');

router.post('/', verifyToken, groupController.createGroup);
router.post('/join', verifyToken, groupController.joinGroup);
router.get('/', verifyToken, groupController.getGroups);
router.get('/members', verifyToken, groupController.getGroupMembers);
router.post('/addMember', verifyToken, groupController.addGroupMember);
router.post('/removeMember', verifyToken, groupController.removeGroupMember);
router.post('/makeAdmin', verifyToken, groupController.makeAdmin);
router.delete('/:groupName', verifyToken, groupController.deleteGroup);

module.exports = router;
