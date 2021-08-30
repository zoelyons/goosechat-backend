const route = require('express').Router();
const CreateError = require('http-errors');
const channelService = require('../../../services/channel');
const serverService = require('../../../services/server');


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
  })



};