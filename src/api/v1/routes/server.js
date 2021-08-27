const route = require('express').Router();
// const { body, validationResult } = require('express-validator');
const CreateError = require('http-errors');
const serverService = require('../../../services/server');
const channelService = require('../../../services/channel');
const messageService = require('../../../services/message');


module.exports = (app) => {
  app.use('/server', route);

  // route.get('/', async (req, res, next) => {
  //   try {
  //     let servers = await serverService.get();
  //     return res.status(201).json({ servers });
  //   } catch (error) {
  //     next(error);
  //   }
  // })

  route.post('/', async (req, res, next) => {
    try {
      if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
      let server = await serverService.create(req.user._id, req.body);
      let channel = await channelService.create(req.user._id, { name: 'Welcome', description: 'Welcome to the server!', server: server._id });
      return res.status(201).json({ server, channel });
    } catch (error) {
      next(error);
    }
  })

  route.get('/join/:id', async (req, res, next) => {
    try {
      if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
      let server = await serverService.join(req.params.id, req.user._id);
      let channel = await channelService.join(req.params.id, req.user._id);
      return res.status(201).json({ server });
    } catch (error) {
      next(error);
    }
  })

  route.post('/join', async (req, res, next) => {
    try {
      if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
      let server = await serverService.joinByName(req.body.name, req.user._id);
      let channel = await channelService.join(server._id, req.user._id);
      return res.status(201).json({ server });
    } catch (error) {
      next(error);
    }
  })

  route.get('/', async (req, res, next) => {
    //get servers user is in
    // get channels user is in (attach them to server?)
    // get messages for each channel, attach them to channels?

    // todo: CLEAN UP!!!!
    try {
      let serverRecords = await serverService.getServersByUserId(req.user._id);
      let servers = JSON.parse(JSON.stringify(serverRecords));
      let unresolvedServers = servers.map(async(server) => {
        let channelRecords = await channelService.getChannelsByServerId(server._id);
        let channels = JSON.parse(JSON.stringify(channelRecords));
        let unresolvedChannels = channels.map(async(channel) => {
          let messageRecords = await messageService.getMessagesByChannelId(channel._id);
          let messages = JSON.parse(JSON.stringify(messageRecords));
          channel.messages = messages;
          return channel;
        })
        const resolvedChannels = await Promise.all(unresolvedChannels)
        server.channels = resolvedChannels;
        return server;
      })
      const resolvedServers = await Promise.all(unresolvedServers)
      return res.status(201).json({ servers: resolvedServers });
    } catch (error) {
      next(error);
    }
  })

  route.post('/channel/', async (req, res, next) => {
    try {
      if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
      let channel = await serverService.createChannel(req.user._id, req.body);
      return res.status(201).json({ channel });
    } catch (error) {
      next(error);
    }
  })



};