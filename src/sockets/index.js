const serverService = require('../services/server');
const channelService = require('../services/channel');
const messageService = require('../services/message');

module.exports = (io) => {  

  io.on("connection", async (socket) => {
    const channels = await channelService.getChannelsByUserId(socket.user._id);
    let rooms = [];
    channels.forEach(channel => {
      rooms.push(channel._id.toString());
    })
    socket.join(rooms);
    console.log(`socket.io connected: ${socket.id}`);    
    socket.on("channelMessage", async (data) => {
      let message = await messageService.create(socket.user._id, data);
      io.to(data.channel).emit('channelMessage', message);
    });

    socket.on("disconnect", () => {
        console.log(`Client ${socket.id} diconnected`);
    });
  });
};