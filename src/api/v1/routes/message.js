const route = require('express').Router();
const CreateError = require('http-errors');
const messageService = require('../../../services/message');


module.exports = (app) => {
  app.use('/message/', route);

  route.get('/:id', async (req, res, next) => {
    try {
      let messages = await messageService.getMessagesByChannelId(req.params.id);
      return res.status(201).json({ messages });
    } catch (error) {
      next(error);
    }
  })

  route.get('/', async (req, res, next) => {
    try {
      let messages = await messageService.getMessagesByUserId(req.user._id);
      return res.status(201).json({ messages });
    } catch (error) {
      next(error);
    }
  })

  // route.get('/pm/:id', async (req, res, next) => {
  //   try {
  //     let messages = await messageService.getPrivateMessagesByAuthorId(req.user._id, req.params.id);
  //     return res.status(201).json({ messages });
  //   } catch (error) {
  //     next(error);
  //   }
  // })

  route.post('/pm', async (req, res, next) => {
    try {
      if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
      let message = await messageService.createPrivateMessage(req.user._id, req.body);
      return res.status(201).json({ message });
    } catch (error) {
      next(error);
    }
  })

  route.post('/', async (req, res, next) => {
    try {
      if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
      let message = await messageService.create(req.user._id, req.body);
      return res.status(201).json({ message });
    } catch (error) {
      next(error);
    }
  })

};