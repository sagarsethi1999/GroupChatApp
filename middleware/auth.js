const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


const secretKey = process.env.SECRET_KEY; 


module.exports = (req, res, next) => {
   
    const token = req.headers.authorization;

    jwt.verify(token, secretKey, (err, decodedToken) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
       
        req.userId = decodedToken.userId;
        next();
    });
};
