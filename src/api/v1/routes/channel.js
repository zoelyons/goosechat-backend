const route = require('express').Router();
const CreateError = require('http-errors');
const channelService = require('../../../services/channel');
const serverService = require('../../../services/server');
const messageService = require('../../../services/message');


module.exports = (app) => {
  app.use('/channel', route);

  route.post('/', async (req, res, next) => {
    try {
      if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
      let server = await serverService.get(req.body.server);
      let channel = await channelService.create(req.user._id, req.body, server.members);
      return res.status(201).json({ channel });
    } catch (error) {
      next(error);
    }
  });

  route.get('/', async (req, res, next) => {
    try {
      if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
      let channelRecords = await channelService.getMyDirectMessageChannels(req.user._id);
      let channels = JSON.parse(JSON.stringify(channelRecords));
      let unresolvedChannels = channels.map(async(channel) => {
        let messageRecords = await messageService.getMessagesByChannelId(channel._id);
        let messages = JSON.parse(JSON.stringify(messageRecords));
        channel.messages = messages;
        return channel;
      })
      const resolvedChannels = await Promise.all(unresolvedChannels)
      return res.status(201).json({ channels: resolvedChannels });
    } catch (error) {
      next(error);
    }
  });

  route.post('/private', async (req, res, next) => {
    try {
      if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
      let channel = await channelService.createDirectMessageChannel(req.user._id, req.body);
      return res.status(201).json({ channel });
    } catch (error) {
      next(error);
    }
  })



};