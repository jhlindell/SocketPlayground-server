const app = require('express')();
const server = require('http').Server(app);
const io = require('./socket');
const cors = require('cors');

const Port = process.env.PORT || 8000;

io.attach(server, {
	pingInterval: 10000,
	pingTimeout: 5000,
	cookie: false,
});

server.listen(Port, () => {
    console.log("Now listening on port " + Port);
  });
  
app.use((req, res, next) => {
  res.sendStatus(404);
});
