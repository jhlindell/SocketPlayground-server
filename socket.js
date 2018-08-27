const io = require('socket.io')();
const winston = require('winston');
const winConfig = require('./config/winston.config');
const chatUsers = require('./users');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(winConfig.console)
  ],
});

io.on('connection', (socket) => {
  sendUserListToAll = () => {
    const userList = chatUsers.getUserList();
    socket.broadcast.emit('userList', userList);
    socket.emit('userList', userList);
  }
  sendUserListToAll();

  socket.on('login', (user) => {
    //set user starting room to zero
    if(user){
      user.room = 0;
      chatUsers.addUser(socket.id, user);
    } else {
      logger.error('no user for login', user);
    }
    sendUserListToAll();
  });

  socket.on('logout', () => {
    chatUsers.removeUser(socket.id);
    sendUserListToAll();
  });

  socket.on('changeRoom', (roomNumber) => {
    let user = chatUsers.getUser(socket.id);
    socket.leave(user.room);
    user = chatUsers.changeRoom(socket.id, roomNumber);
    socket.join(roomNumber);
    socket.emit('roomChanged', user);
    sendUserListToAll();
  });
  
  socket.on('message', (message) => {
    let user = chatUsers.getUser(socket.id);
    if(user){
      const timeStamp = new Date().toString();
      io.in(user.room).emit('newMessage', { username: user.name, message, timeStamp });
    }
  });

  socket.on('privateMessage', (obj) => {
    let userId = chatUsers.getIdByUsername(obj.username);
    let senderName = chatUsers.getUsernameById(socket.id);
    if(userId){
      const privateMessage = 'Private: ' + obj.message;
      const timeStamp = new Date().toString();
      socket.to(userId).emit('newMessage', { username: senderName, message: privateMessage, timeStamp })
    } else {
      logger.error('bad username given for private message', obj);
    }
  });

  socket.on('spam', ()=> {
    let user = chatUsers.getUser(socket.id);
    const timeStamp = new Date().toString();
    io.of('/').emit('newMessage', { username: user.name, message: 'I NEED ATTENTION. LOOK AT ME!!!', timeStamp});
  })

  socket.on('disconnect', () => {
    chatUsers.removeUser(socket.id);
    sendUserListToAll();
  });

  socket.on('error', (err) => {
    logger.error(`received error from socket: ${socket.id}`);
    logger.error(err);
  });
});

module.exports = io;