const event = (socket, request) => {
  socket.emit('addRequest', request);
}

module.exports = event
