const event = (socket, channel) => {
  socket.emit('add', channel)
}

module.exports = event
