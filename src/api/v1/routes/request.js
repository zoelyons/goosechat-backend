const route = require('express').Router();
const CreateError = require('http-errors');
const requestService = require('../../../services/request');
const userService = require('../../../services/user');

module.exports = (app) => {
  app.use('/request', route);

  route.get('/', async (req, res, next) => {
    try {
      if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
      let requests = await requestService.getRequestsByUserId(req.user._id, true);
      return res.status(201).json({ requests });
    } catch (error) {
      next(error);
    }
  })

  route.patch('/:id', async (req, res, next) => {
    try {
      const { accepted, declined } = req.body;
      if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
      let request = await requestService.updateRequest(req.params.id, req.user._id, { accepted, declined, });
      await userService.addFriend(request.sender, request.recipient);
      await userService.addFriend(request.recipient, request.sender);
      return res.status(201).json({ request });
    } catch (error) {
      next(error);
    }
  })

};