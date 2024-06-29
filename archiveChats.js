const { Op } = require('sequelize');
const Chat = require('./models/chat');
const ArchivedChat = require('./models/ArchivedChat');
const sequelize = require('./util/database');

const archiveOldChats = async () => {
    const transaction = await sequelize.transaction();

    try {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        const oldChats = await Chat.findAll({
            where: {
                createdAt: {
                    [Op.lt]: oneDayAgo
                }
            },
            transaction
        });

        const archivedChats = oldChats.map(chat => ({
            userId: chat.userId,
            groupId: chat.groupId,
            message: chat.message,
            createdAt: chat.createdAt
        }));

        await ArchivedChat.bulkCreate(archivedChats, { transaction });

        await Chat.destroy({
            where: {
                createdAt: {
                    [Op.lt]: oneDayAgo
                }
            },
            transaction
        });

        await transaction.commit();
        console.log('Old chats archived and deleted successfully');
    } catch (error) {
        await transaction.rollback();
        console.error('Error archiving old chats:', error);
    } 
};

archiveOldChats();









// const { Op } = require('sequelize');
// const Chat = require('./models/chat');
// const ArchivedChat = require('./models/ArchivedChat');
// const sequelize = require('./util/database');

// const archiveOldChats = async () => {
//     const transaction = await sequelize.transaction();

//     try {
//         const oneMinuteAgo = new Date();
//         oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);

//         const oldChats = await Chat.findAll({
//             where: {
//                 createdAt: {
//                     [Op.lt]: oneMinuteAgo
//                 }
//             },
//             transaction
//         });

//         const archivedChats = oldChats.map(chat => ({
//             userId: chat.userId,
//             groupId: chat.groupId,
//             message: chat.message,
//             createdAt: chat.createdAt
//         }));

//         await ArchivedChat.bulkCreate(archivedChats, { transaction });

//         await Chat.destroy({
//             where: {
//                 createdAt: {
//                     [Op.lt]: oneMinuteAgo
//                 }
//             },
//             transaction
//         });

//         await transaction.commit();
//         console.log('Old chats archived and deleted successfully');
//     } catch (error) {
//         await transaction.rollback();
//         console.error('Error archiving old chats:', error);
//     } 
// };

// archiveOldChats();
