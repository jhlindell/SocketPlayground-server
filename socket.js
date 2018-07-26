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
    if(user){
      user.room = 0;
      chatUsers.addUser(client.id, user);
    } else {
      logger.error('no user for login', user);
    }
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
    io.in(user.room).emit('newMessage', { username: user.name, message, timeStamp });
  });

  client.on('privateMessage', (obj) => {
    let userId = chatUsers.getIdByUsername(obj.username);
    if(userId){
      const privateMessage = 'Private: ' + obj.message;
      const timeStamp = new Date().toString();
      client.to(userId).emit('newMessage', { username: obj.username, message: privateMessage, timeStamp })
    } else {
      logger.error('bad username given for private message', obj);
    }
  });

  client.on('spam', ()=> {
    let user = chatUsers.getUser(client.id);
    const timeStamp = new Date().toString();
    io.of('/').emit('newMessage', { username: user.name, message: 'I NEED ATTENTION. LOOK AT ME!!!', timeStamp});
  })

  client.on('disconnect', () => {
    chatUsers.removeUser(client.id);
    sendUserListToAll();
  });

  client.on('error', (err) => {
    logger.error(`received error from client: ${client.id}`);
    logger.error(err);
  });
});

module.exports = io;