const events = require('../events');
const channelService = require('../../services/channel');
const messageService = require('../../services/message');


module.exports = function (io, socket) {
  socket.on('createDirectMessage', async(data) => {
    let channel = await channelService.createDirectMessageChannel(socket.user._id, data);
    events.newDirectMessageChannel(socket, channel);
    // io.to(data.channel).emit('channelMessage', message);
  });
}