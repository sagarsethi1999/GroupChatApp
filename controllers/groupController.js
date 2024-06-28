const Group = require('../models/group');
const UserGroup = require('../models/userGroup');
const User = require('../models/user');
const Chat = require('../models/chat');
const { Op } = require('sequelize');

exports.getGroups = async (req, res) => {
    try {
        const userId = req.user.id;
        const userGroups = await UserGroup.findAll({
            where: { userId },
            include: [{ model: Group }]
        });
        res.status(200).json({ groups: userGroups.map(ug => ug.group) });
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.createGroup = async (req, res) => {
    const { name, password } = req.body;
    const userId = req.user.id;

    try {
        const group = await Group.create({ name, password });
        await UserGroup.create({ userId, groupId: group.id, role: 'admin' });
        res.status(201).json({ message: 'Group created successfully', group });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create group' });
    }
};

exports.joinGroup = async (req, res) => {
    try {
        const { name, password } = req.body;
        const group = await Group.findOne({ where: { name } });
        if (!group || group.password !== password) {
            return res.status(401).json({ message: 'Invalid group name or password' });
        }
        await UserGroup.create({ userId: req.user.id, groupId: group.id });
        res.status(200).json({ message: 'Joined group successfully' });
    } catch (error) {
        console.error('Error joining group:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



exports.getGroupMembers = async (req, res) => {
    const { groupName } = req.query;
    try {
  
        const group = await Group.findOne({
            where: { name: groupName },
            include: [{
                model: User,
                attributes: ['id', 'name']
            }]
        });

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        
        const membersWithRoles = await Promise.all(group.users.map(async (member) => {
            const userGroup = await UserGroup.findOne({
                where: {
                    userId: member.id,
                    groupId: group.id
                },
                attributes: ['role']
            });
            return {
                id: member.id,
                name: member.name,
                role: userGroup ? userGroup.role : 'member' 
            };
        }));

        console.log(membersWithRoles);
        res.status(200).json({ members: membersWithRoles });
    } catch (error) {
        console.error('Error loading group members:', error);
        res.status(500).json({ message: 'Failed to load group members' });
    }
};




exports.addGroupMember = async (req, res) => {
    const { groupName, memberIdentifier } = req.body;
    console.log('groupname of adding member', groupName);
    console.log('memberIdentifier of adding member', memberIdentifier);
    try {
        const group = await Group.findOne({ where: { name: groupName } });
        const user = await User.findOne({ 
            where: { 
                [Op.or]: [
                    { name: memberIdentifier },
                    { email: memberIdentifier },
                    { number: memberIdentifier }
                ] 
            } 
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await UserGroup.create({ userId: user.id, groupId: group.id, role: 'member' });
        res.status(200).json({ message: 'Member added successfully' });
    } catch (error) {
        console.error('Error adding member:', error);
        res.status(500).json({ message: 'Failed to add member' });
    }
};

exports.removeGroupMember = async (req, res) => {
    const { groupName, memberName } = req.body;
    try {
        const group = await Group.findOne({ where: { name: groupName } });
        const user = await User.findOne({ where: { name: memberName } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await UserGroup.destroy({ where: { userId: user.id, groupId: group.id } });
        res.status(200).json({ message: 'Member removed successfully' });
    } catch (error) {
        console.error('Error removing member:', error);
        res.status(500).json({ message: 'Failed to remove member' });
    }
};

exports.makeAdmin = async (req, res) => {
    const { groupName, memberName } = req.body;
    try {
        const group = await Group.findOne({ where: { name: groupName } });
        const user = await User.findOne({ where: { name: memberName } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userGroup = await UserGroup.findOne({ where: { userId: user.id, groupId: group.id } });
        userGroup.role = 'admin';
        await userGroup.save();
        
        res.status(200).json({ message: 'User promoted to admin successfully' });
    } catch (error) {
        console.error('Error making admin:', error);
        res.status(500).json({ message: 'Failed to make admin' });
    }
};


exports.deleteGroup = async (req, res) => {
    const { groupName } = req.params;

    try {
        const group = await Group.findOne({
            where: {
                name: groupName
            }
        });

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        await Chat.destroy({
            where: {
                groupId: group.id
            }
        });

        await UserGroup.destroy({
            where: { groupId: group.id }
        });

        await group.destroy();

        res.status(200).json({ message: 'Group and associated chats deleted successfully' });
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ error: 'Failed to delete group and associated chats' });
    }
};

