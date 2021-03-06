if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const app = require('express')();
const server = require('http').Server(app);
const io = require('./socket');
const cors = require('cors');
const winston = require('winston');
const winConfig = require('./config/winston.config');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(winConfig.console)
  ],
});
const Port = process.env.PORT || 8000;

app.use(cors(process.env.IOURL));

io.attach(server, {
	pingInterval: 10000,
	pingTimeout: 5000,
	cookie: false,
});

server.listen(Port, () => {
  logger.info(`Now listening on port ${Port}`);
});
  
app.use((req, res) => {
  res.send('sorry, no api calls here');
});
