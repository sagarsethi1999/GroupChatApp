// const Chat = require('../models/chat');
// const User = require('../models/user');
// const { Op } = require('sequelize');




// exports.sendMessage = async (req, res) => {
//     const { message } = req.body;
//     const userId = req.user.id;

//     try {
//         const chatMessage = await Chat.create({ userId, message });
//         res.status(200).json({ message: 'Message sent successfully', chatMessage });
//     } catch (error) {
//         console.error('Error sending message:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// // exports.getMessages = async (req, res) => {
// //     console.log('hello i am inside getmessages')
// //     try {
// //         const messages = await Chat.findAll({
// //             include: { model: User, attributes: ['name'] },
// //             order: [['createdAt', 'ASC']] 
// //         });
// //         const formattedMessages = messages.map(message => ({
// //             name: message.user.name,
// //             message: message.message
// //         }));

// //         console.log(formattedMessages);
// //         res.status(200).json({ messages });
// //     } catch (error) {
// //         console.error('Error fetching messages:', error);
// //         res.status(500).json({ message: 'Internal server error' });
// //     }
// // };    



// exports.getMessages = async (req, res) => {
//     const { lastMessageId } = req.query;

//     try {
//         let messages;
//         if (lastMessageId) {
//             // Fetch only new messages after the lastMessageId
//             messages = await Chat.findAll({
//                 where: { id: { [Op.gt]: lastMessageId } },
//                 include: { model: User, attributes: ['name'] },
//                 order: [['createdAt', 'ASC']]
//             });
//         } else {
//             // Fetch all messages
//             messages = await Chat.findAll({
//                 include: { model: User, attributes: ['name'] },
//                 order: [['createdAt', 'ASC']]
//             });
//         }

//         // Extracting message data along with user name
//         const formattedMessages = messages.map(message => ({
//             name: message.user ? message.user.name : 'Unknown', // Check if message.user exists
//             message: message.message
//         }));

//         res.status(200).json({ messages: formattedMessages });
//     } catch (error) {
//         console.error('Error fetching messages:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// ---------------------------------------------------------------------------------------------------------------------//
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
