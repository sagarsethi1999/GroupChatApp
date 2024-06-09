const Chat = require('../models/chat');

exports.sendMessage = async (req, res) => {
    const { message } = req.body;
    const userId = req.user.id;

    try {
        const chatMessage = await Chat.create({ userId, message });
        res.status(200).json({ message: 'Message sent successfully', chatMessage });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

