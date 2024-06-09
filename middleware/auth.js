const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();



const verifyToken = (req, res, next) => {
    console.log('Inside middleware');
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Unauthorized');

    jwt.verify(token, 'secretKey', (err, DecodedUser) => {
        if (err) {
            console.error('Error verifying token:', err);
            return res.status(403).send('Forbidden');
        }
        console.log('Decoded user:', DecodedUser);
        req.user = DecodedUser;
        next();
    });
};



module.exports = verifyToken;

