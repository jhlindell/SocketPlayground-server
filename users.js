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
      console.log('error')
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
    getUsernameById
  }
})();

module.exports = Users;