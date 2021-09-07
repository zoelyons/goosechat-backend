const events = require('../events');
const channelService = require('../../services/channel');
const messageService = require('../../services/message');


module.exports = function (io, socket) {
  socket.on('createDirectMessage', async(_id, callback) => {
    try {
      let channelExists = await channelService.findDirectMessageChannelByIds(socket.user._id, _id);
      if (channelExists) throw { message: `DM Already exists.` };
      let channel = await channelService.createDirectMessageChannel(socket.user._id, _id);
      socket.join(`channel_${channel._id}`);
      for (const [_, socket] of io.of("/").sockets) {
        if (socket.user._id == _id) {
          socket.join(`channel_${channel._id}`);
        }
      }
      io.to(`channel_${channel._id}`).emit('addChannel', channel);
    } catch (error) {
      callback(error, null);
    }
  });
}