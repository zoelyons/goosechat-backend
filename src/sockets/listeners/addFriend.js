const events = require('../events');
const userService = require('../../services/user');
const requestService = require('../../services/request');


module.exports = function (io, socket) {
  socket.on('addFriend', async (username, callback) => {
    try {
      if (socket.user.username == username) throw { message: "Can't friend yourself." };
      const recipient = await userService.getUserByUsername(username);
      if (!recipient) throw { message: `Username ${username} not found.` };
      if (recipient.friends.includes(socket.user._id)) throw { message: `Already friends with this user.` };
      const requestExists = await requestService.getRequestByUserIds(socket.user._id, recipient._id, true);
      if (requestExists) throw { message: `Friend request sent already.` };
      const request = await requestService.newRequest(socket.user._id, recipient._id);
      for (const [_, socket] of io.of("/").sockets) {
        if (socket.user._id == recipient._id) events.addRequest(socket, request);
      }
      return callback(null, { message: 'Friend request sent.' })
    } catch (error) {
      console.log(error);
      callback(error, null);
    }
  });
}
