const events = require('../events');
const userService = require('../../services/user');
const requestService = require('../../services/request');
const channelService = require('../../services/channel');

module.exports = function (io, socket) {
  socket.on('acceptRequest', async (data, callback) => {
    let request = await requestService.updateRequest(data.request, socket.user._id, { accepted: true, declined: false });
    await userService.addFriend(request.sender, request.recipient);
    await userService.addFriend(request.recipient, request.sender);
    for (const [_, socket] of io.of("/").sockets) {
      if (socket.user._id == request.sender._id) {
        let sender = await userService.getUser(request.sender);
        events.updateUser(socket, sender);
      }
      if (socket.user._id == request.recipient._id) {
        let recipient = await userService.getUser(request.recipient);
        let recipientRequests = await requestService.getRequestsByUserId(request.recipient._id, true);
        events.updateUser(socket, recipient);
        events.populateRequests(socket, recipientRequests);
      }
    }

    let channelExists = await channelService.findDirectMessageChannelByIds(socket.user._id, request.sender._id);
    if (channelExists) throw { message: `DM Already exists.` };
    let channel = await channelService.createDirectMessageChannel(socket.user._id, request.sender._id);
    socket.join(`channel_${channel._id}`);
    for (const [_, socket] of io.of("/").sockets) {
      if (socket.user._id == request.sender._id) {
        socket.join(`channel_${channel._id}`);
      }
    }
    io.to(`channel_${channel._id}`).emit('addChannel', channel);


  });
}