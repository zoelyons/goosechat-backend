const events = require('../events');
const userService = require('../../services/user');
const requestService = require('../../services/request');


module.exports = function (io, socket) {
  socket.on('acceptRequest', async(data, callback) => {
    let request = await requestService.updateRequest(data.request, socket.user._id, { accepted: true, declined: false });
    await userService.addFriend(request.sender, request.recipient);
    await userService.addFriend(request.recipient, request.sender);
    let sender = await userService.getUser(request.sender);
    let recipient = await userService.getUser(request.recipient);
    console.log(recipient);
    for (const [_, socket] of io.of("/").sockets) {
      if (socket.user._id == request.sender._id) events.updateUser(socket, sender);
      if (socket.user._id == request.recipient._id) events.updateUser(socket, recipient);
    }
  });
}