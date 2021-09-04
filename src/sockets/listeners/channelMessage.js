const events = require('../events');
const messageService = require('../../services/message');


module.exports = function (io, socket) {
  socket.on("channelMessage", async(data) => {
    let message = await messageService.create(socket.user._id, data);
    io.to(`channel_${data.channel}`).emit('chatMessage', message);
  });
}