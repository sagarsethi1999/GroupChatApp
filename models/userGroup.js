const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = require('./user');
const Group = require('./group');

const UserGroup = sequelize.define('userGroup', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'member' // Default role is member
    }
});

UserGroup.belongsTo(User);
UserGroup.belongsTo(Group);

module.exports = UserGroup;
