
const Chat = require('../models/chat');
const User = require('../models/user');
const Group = require('../models/group');


exports.getMessages = async (req, res) => {
    const { groupName } = req.query;
    console.log(`Fetching messages for groupName: ${groupName}`);
    try {
        const group = await Group.findOne({ where: { name: groupName } });
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        const messages = await Chat.findAll({
            where: { groupId: group.id },
            include: [{ model: User }]
        });
        res.status(200).json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Error fetching messages' });
    }
};

exports.sendMessage = async (req, res) => {
    const { message, groupName } = req.body;
    const userId = req.user.id;
    try {
        const group = await Group.findOne({ where: { name: groupName } });
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        const newMessage = await Chat.create({ message, groupId: group.id, userId });
        res.status(201).json({ message: 'Message sent', newMessage });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Error sending message' });
    }
};

exports.clearMessages = async (req, res) => {
    const { groupName } = req.body;

    try {
        const group = await Group.findOne({ where: { name: groupName } });

        if (!group) {
            return res.status(404).send({ error: 'Group not found' });
        }
        await Chat.destroy({ where: { groupId: group.id } });
        res.status(200).send({ message: 'Chat cleared successfully' });
    } catch (error) {
        console.error('Error clearing chat:', error);
        res.status(500).send({ error: 'Failed to clear chat' });
    }
};