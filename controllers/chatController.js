const Chat = require('../models/chat');
const User = require('../models/user');

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

exports.getMessages = async (req, res) => {
    console.log('hello i am inside getmessages')
    try {
        const messages = await Chat.findAll({
            include: { model: User, attributes: ['name'] },
            order: [['createdAt', 'ASC']] 
        });
        const formattedMessages = messages.map(message => ({
            name: message.user.name,
            message: message.message
        }));

        console.log(formattedMessages);
        res.status(200).json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};    