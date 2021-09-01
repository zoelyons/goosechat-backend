const event = (socket, user) => {
  socket.emit('updateUser', user);
}

module.exports = event
