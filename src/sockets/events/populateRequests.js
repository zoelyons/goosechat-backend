const event = (socket, requests) => {
  socket.emit('populateRequests', requests);
}

module.exports = event
