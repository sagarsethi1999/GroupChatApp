const bcrypt = require('bcrypt');
const User = require('../models/user');

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
