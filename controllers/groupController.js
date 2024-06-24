const Group = require('../models/group');
const UserGroup = require('../models/userGroup');
const User = require('../models/user');

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
    try {
        const { name, password } = req.body;
        const group = await Group.create({ name, password });
        await UserGroup.create({ userId: req.user.id, groupId: group.id });
        res.status(201).json({ group });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: 'Internal server error' });
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
        const group = await Group.findOne({ where: { name: groupName } });
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const members = await Group.findOne({
            where: { name: groupName },
            include: [{ model: User, attributes: ['name'] }]
        });

        const memberNames = members.users.map(user => user.name);

        console.log(memberNames);

        res.json({ members: memberNames });
    } catch (error) {
        console.error('Error fetching group members:', error);
        res.status(500).json({ error: 'Failed to fetch group members' });
    }
};