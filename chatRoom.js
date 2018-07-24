const chatRoom = (foo = () => {
  messages = [];

  function addMessage(username, message){
    const timeStamp = new Date().toString();
    messages.push({ username, message, timeStamp });
  }

  function getMessages(){
    return messages;
  }

  return {
    addMessage,
    getMessages
  }
})();

module.exports = chatRoom;