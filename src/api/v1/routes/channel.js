const route = require('express').Router();
const CreateError = require('http-errors');
const channelService = require('../../../services/channel');


module.exports = (app) => {
  app.use('/channel', route);

  route.post('/', async (req, res, next) => {
    try {
      if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
      let channel = await channelService.create(req.user._id, req.body);
      return res.status(201).json({ channel });
    } catch (error) {
      next(error);
    }
  })



};