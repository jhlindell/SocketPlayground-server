const io = require('socket.io')();
const winston = require('winston');
const winConfig = require('./config/winston.config');
const chatUsers = require('./users');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(winConfig.console),
    // new winston.transports.File(winConfig.file),
  ],
});

io.on('connection', (client) => {
  sendUserListToAll = () => {
    const userList = chatUsers.getUserList();
    client.broadcast.emit('userList', userList);
    client.emit('userList', userList);
  }

  sendUserListToAll();

  client.on('login', (user) => {
    //set user starting room to zero
    user.room = 0;
    chatUsers.addUser(client.id, user);
    sendUserListToAll();
  });

  client.on('logout', () => {
    chatUsers.removeUser(client.id);
    sendUserListToAll();
  });

  client.on('changeRoom', (roomNumber) => {
    let user = chatUsers.getUser(client.id);
    client.leave(user.room);
    user = chatUsers.changeRoom(client.id, roomNumber);
    client.join(roomNumber);
    client.emit('roomChanged', user);
    sendUserListToAll();
  });
  
  client.on('message', (message) => {
    let user = chatUsers.getUser(client.id);
    const timeStamp = new Date().toString();
    io.in(user.room).emit('newMessage', { username: user.name, message, timeStamp});
  });

  client.on('disconnect', () => {
    logger.info(`client disconnect... ${client.id}`);
    chatUsers.removeUser(client.id);
    sendUserListToAll();
  });

  client.on('error', (err) => {
    logger.error(`received error from client: ${client.id}`);
    logger.error(err);
  });
});

module.exports = io;