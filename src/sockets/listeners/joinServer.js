const events = require('../events');
const channelService = require('../../services/channel');
const serverService = require('../../services/server');


module.exports = function (io, socket) {
  socket.on('joinServer', async(name) => {
    let server = await serverService.joinByName(name, socket.user._id);
    let channels = await channelService.join(server._id, socket.user._id);
    // let rooms = []
    // channels.forEach(channel => rooms.push(channel._id.toString()));
    // socket.join(rooms);
    events.joinServer(io, socket, server, channels);
    // let channel = await channelService.createDirectMessageChannel(socket.user._id, data);
    // events.newDirectMessageChannel(socket, channel);
    // io.to(data.channel).emit('channelMessage', message);
  });
}

// route.post('/join', async (req, res, next) => {
//   try {
//     if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
//     let server = await serverService.joinByName(req.body.name, req.user._id);
//     let channel = await channelService.join(server._id, req.user._id);
//     return res.status(201).json({ server });
//   } catch (error) {
//     next(error);
//   }
// })