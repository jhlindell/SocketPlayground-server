const io = require('socket.io')();
const winston = require('winston');
const winConfig = require('./config/winston.config');


const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(winConfig.console),
    // new winston.transports.File(winConfig.file),
  ],
});

io.on('connection', (client) => {
  logger.info(`user ${client.id} connected`);npm 
  
  client.on('join', (room) => {
    client.join(room);
    logger.info(`client ${client.id} joined room ${room}`);
    client.emit('joined', `joined room ${room}`);
  });

  client.on('leave', (room) => {
    client.leave(room);
    logger.info(`client ${client.id} left room ${room}`);
    client.emit('left room', `left room ${room}`);
  });

  client.on('disconnect', () => {
    logger.info(`client disconnect... ${client.id}`);
  });

  client.on('error', (err) => {
    logger.error(`received error from client: ${client.id}`);
    logger.error(err);
  });
});

module.exports = io;