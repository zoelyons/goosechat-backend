const events = require('../events');
const userService = require('../../services/user');
const requestService = require('../../services/request');
const channelService = require('../../services/channel');

module.exports = function (io, socket) {
  socket.on('declineRequest', async (data, callback) => {
    await requestService.updateRequest(data.request, socket.user._id, { accepted: false, declined: true });
    let recipientRequests = await requestService.getRequestsByUserId(socket.user._id, true);
    events.populateRequests(socket, recipientRequests);
  });
}