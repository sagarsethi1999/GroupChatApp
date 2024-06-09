const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const sequelize = require('./util/database');
const User = require('./models/user');
const Chat = require('./models/chat'); 

const app = express();
const PORT = 3000;

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/chat', chatRoutes);

sequelize
.sync()
// .sync({force:true})
    .then(() => {
        console.log('Database & tables created!');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to create the database:', err);
    });
