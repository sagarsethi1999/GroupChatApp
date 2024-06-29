const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const ArchivedChat = sequelize.define('ArchivedChat', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    timestamps: false,
});

module.exports = ArchivedChat;
