const event = (io, socket, server, channels) => {
  socket.join(`server_${server._id}`);
  io.to(`server_${server._id}`).emit('updateServer', server);
  channels.forEach(channel => {
    socket.join(`channel_${channel._id}`);
  })
}

module.exports = event
