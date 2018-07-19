const io = require('socket.io')();

io.on('connection', (client) => {
  client.on('join', (room) => {
    client.join(room);
  });

  client.on('leave', (room) => {
    client.leave(room);
  });

  client.on('disconnect', () => {
    console.log('client disconnect...', client.id)
    handleDisconnect()
  });

  client.on('error', (err) => {
    console.log('received error from client:', client.id)
    console.log(err)
  });
});

module.exports = io;