const Users = (foo = () =>{
  const users = new Map();

  function addUser(id, user){
    users.set(id, user);
  }

  function removeUser(id){
    users.delete(id);
  }

  function getUserList(){
    const userList = Array.from(users.values());
    return userList;
  }

  function getUsernameById(id){
    const user = users.get(id);
    return user.name;
  }

  return {
    addUser,
    removeUser,
    getUserList,
    getUsernameById
  }
})();

module.exports = Users;