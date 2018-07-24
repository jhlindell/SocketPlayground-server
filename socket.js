const io = require('socket.io')();
const winston = require('winston');
const winConfig = require('./config/winston.config');
const chatUsers = require('./users');
const chatRoom = require('./chatRoom');

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

  sendMessagesToAll = () => {
    const messages = chatRoom.getMessages();
    client.broadcast.emit('chatMessages', messages);
    client.emit('chatMessages', messages);
  }

  // logger.info(`user ${client.id} connected`);
  sendUserListToAll();
  sendMessagesToAll();

  client.on('login', (user) => {
    chatUsers.addUser(client.id, user, 0);
    sendUserListToAll();
  });

  client.on('logout', () => {
    chatUsers.removeUser(client.id);
    sendUserListToAll();
  });
  
  client.on('join', (room) => {
    client.join(room);
    // logger.info(`client ${client.id} joined room ${room}`);
    client.emit('joined', `joined room ${room}`);
  });

  client.on('leave', (room) => {
    client.leave(room);
    // logger.info(`client ${client.id} left room ${room}`);
    client.emit('left room', `left room ${room}`);
  });

  client.on('message', (message) => {
    const username = chatUsers.getUsernameById(client.id);
    chatRoom.addMessage(username, message);
    sendMessagesToAll();
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