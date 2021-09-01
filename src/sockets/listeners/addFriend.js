const events = require('../events');
const userService = require('../../services/user');
const requestService = require('../../services/request');


module.exports = function (io, socket) {
  socket.on('addFriend', async(data, callback) => {
      // console.log(io.sockets.sockets);
      // for (const socket in io.sockets.sockets) {
      //   console.log(socket.user);
      // }

    if (socket.user.username == data.username) return callback({ error: { message: 'Can not friend yourself.' }});
    const recipient = await userService.getUserByUsername(data.username);
    if (!recipient) return callback({ error: { message: `Username ${data.username} not found.` }});
    if (recipient.friends.includes(socket.user._id)) callback({ error: { message: `Already friends with user.` }});
    const request = await requestService.newRequest(socket.user._id, recipient._id);
    for (const [_, socket] of io.of("/").sockets) {
      if (socket.user._id == recipient._id) events.addRequest(socket, request);
    }
    // let channel = await channelService.createDirectMessageChannel(socket.user._id, data);
    // events.newDirectMessageChannel(socket, channel);
    // io.to(data.channel).emit('channelMessage', message);
  });
}

// route.get('/add/:username', async (req, res, next) => {
//   try {
//     if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
//     if (req.user.username == req.params.username) throw new CreateError(400, 'You can not friend yourself!');
//     const recipient = await userService.getUserByUsername(req.params.username);
//     if (!recipient) throw new CreateError(404, `User with Username ${req.params.username} not found.`);
//     if (recipient.friends.includes(req.user._id)) throw new CreateError(404, `Already friends with user.`);
//     const request = await requestService.newRequest(req.user._id, recipient._id);
//     return res.status(201).json({ request });
//   } catch (error) {
//     next(error);
//   }
// })