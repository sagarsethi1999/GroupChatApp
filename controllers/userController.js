const bcrypt = require('bcrypt');
const User = require('../models/user');
const Group = require('../models/group');
const UserGroup = require('../models/userGroup');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();



exports.signup = async (req, res) => {
    const { name, email, number, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            console.log('User already exists with email:', email);
            return res.status(409).json({ message: 'User already exists, Please Login' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({ name, email, number, password: hashedPassword });
        console.log('User signed up:', newUser);

        res.status(200).json({ message: 'Successfully signed up' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};





exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            console.log('User not found with email:', email);
            return res.status(404).send('User not found');
        }

        
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log('Incorrect password for user:', email);
            return res.status(401).send('User not authorized');
        }

        
        const token = jwt.sign({ id: user.id }, 'secretKey');

        res.status(200).json({ token: token , name: user.name});
    } catch (error) {
        console.error('Error during login process:', error);
        res.status(500).send('Internal server error');
    }
};


exports.getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const groupName = req.query.groupName;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const group = await Group.findOne({ where: { name: groupName } });
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const userGroup = await UserGroup.findOne({
            where: {
                userId: user.id,
                groupId: group.id
            }
        });

        const role = userGroup ? userGroup.role : 'member';

        res.status(200).json({ user, role });
    } catch (error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
