const serverService = require('../services/server');
const listeners = require('./listeners');
const channelService = require('../services/channel');


module.exports = (io) => {

  io.on("connection", async (socket) => {
    if (!socket.authenticated) return;
    let rooms = [];
    console.log(`socket connected: ${socket.id} as ${socket.user.username}#${socket.user.tag}`);
    let servers = await serverService.getServersByUserId(socket.user._id);
    let channels = await channelService.getChannelsByUserId(socket.user._id);
    servers.forEach(server => rooms.push('server_' + server._id.toString()));
    channels.forEach(channel => rooms.push('channel_' + channel._id.toString()));
    socket.join(rooms);
    if (rooms.length) console.log(rooms);
    listeners(io, socket);
  })
};