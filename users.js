const winConfig = require('./config/winston.config');
const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(winConfig.console)
  ],
});

const Users = (foo = () =>{
  const users = new Map();

  function addUser(id, user){
    users.set(id, user);
  }

  function removeUser(id){
    users.delete(id);
  }

  function changeRoom(id, room){
    const user = users.get(id);
    if(user){
      user.room = room;
      users.set(id, user);
    } else {
      logger.error('bad id passed to change room');
    }
    return user;
  }

  function getUserList(){
    const userList = Array.from(users.values());
    return userList;
  }

  function getUsernameById(id){
    const user = users.get(id);
    return user.name;
  }

  function getIdByUsername(username){
    let userId = null;
    users.forEach((value, key) => {
      if(username === value.name){
        userId= key;
      }
    });
    return userId;
  }

  function getUser(id){
    const user = users.get(id);
    return user;
  }

  return {
    addUser,
    removeUser,
    changeRoom,
    getUser,
    getUserList,
    getUsernameById,
    getIdByUsername
  }
})();

module.exports = Users;