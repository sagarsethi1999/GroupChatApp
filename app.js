const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const http = require('http');

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const groupRoutes = require('./routes/groupRoutes');

const sequelize = require('./util/database');
const User = require('./models/user');
const Group = require('./models/group');
const UserGroup = require('./models/userGroup');
const Chat = require('./models/chat');
const ArchivedChat = require('./models/ArchivedChat');

const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
    }
});

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
app.use('/groups', groupRoutes);

app.use((req, res) => {
    console.log(`url`, req.url);
    console.log('fully automated');
    res.sendFile(path.join(__dirname, `public/${req.url}`));
});

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });
User.hasMany(Chat, { foreignKey: 'userId' });
Chat.belongsTo(User, { foreignKey: 'userId' });
Group.hasMany(Chat, { foreignKey: 'groupId' });
Chat.belongsTo(Group, { foreignKey: 'groupId' });

sequelize
.sync()
// .sync({force:true})
    .then(() => {
        console.log('Database & tables created!');
        server.listen(PORT, () => {
            console.log(`Server is running on http://3.27.216.215:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to create the database:', err);
    });

const users = {};

io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    socket.on('new-user', (name) => {
        console.log(`User connected: ${name}`);
        users[socket.id] = name;
        console.log('Users:', users);
    });

    socket.on('join-group', ({ groupName, name }) => {
        socket.join(groupName);
        console.log(`User ${name} joined group: ${groupName}`);
        socket.to(groupName).emit('user-connected', name);
    });

    socket.on('leave-group', ({ groupName, name }) => {
        console.log(`User ${name} left group ${groupName}`);
        socket.leave(groupName);
        socket.to(groupName).emit('user-disconnected', name);
    });

    socket.on('send-chat-message', (data, room) => {
        const { message, name } = data;
        if(room){
            console.log('you are  in room ',room)
        }
        console.log(`Message from ${name} in group ${room}: ${message}`);
        socket.to(room).emit('chat-message', { message, name });
    });

    socket.on('disconnect', () => {
        const name = users[socket.id];
        console.log(`User disconnected: ${name}`);
        delete users[socket.id];
        console.log('Users after disconnect:', users);
    });
});


