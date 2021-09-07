const events = require('../events');
const channelService = require('../../services/channel');
const serverService = require('../../services/server');


module.exports = function (io, socket) {
  socket.on('joinServer', async(name, callback) => {
    try {
      let server = await serverService.joinByName(name, socket.user._id);
      let channels = await channelService.join(server._id, socket.user._id);
      events.joinServer(io, socket, server, channels);
    } catch (error) {
      callback(error, null);
    }
  });
}