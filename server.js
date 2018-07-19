const app = require('express')();
const server = require('http').Server(app);
const io = require('./socket');
const cors = require('cors');
const winston = require('winston');
const winConfig = require('./config/winston.config');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(winConfig.console),
    // new winston.transports.File(winConfig.file),
  ],
});
const Port = process.env.PORT || 8000;

io.attach(server, {
	pingInterval: 10000,
	pingTimeout: 5000,
	cookie: false,
});

server.listen(Port, () => {
  logger.log({
    level:'debug',
    message: `Now listening on port ${Port}`,
  });
});
  
app.use((req, res, next) => {
  res.sendStatus(404);
});
