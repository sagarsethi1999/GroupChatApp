const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const User = require('./user');


const Chat = sequelize.define('Chat', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    }
});

User.hasMany(Chat, { foreignKey: 'userId' });
Chat.belongsTo(User, { foreignKey: 'userId' });

module.exports = Chat;
