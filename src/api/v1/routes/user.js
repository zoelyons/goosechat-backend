const route = require('express').Router();
const { body, validationResult } = require('express-validator');
const CreateError = require('http-errors');
const userService = require('../../../services/user');
const requestService = require('../../../services/request');

module.exports = (app) => {
  app.use('/users', route);

  route.get('/:id?', async (req, res, next) => {
    try {
      if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
      if (req.user.role != 'admin') throw new CreateError(401, 'You must be an admin to use this route.');
      if (!req.params.id) {
        let users = await userService.get();
        return res.status(201).json({ users });
      } else {
        let user = await userService.getUser(req.params.id);
        return res.status(201).json({ user });
      }
    } catch (error) {
      next(error);
    }
  })

  route.patch('/me', async (req, res, next) => {
    try {
      if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
      const { user, token } = await userService.updateUser(req.user._id, req.body);
      return res.status(201).json({ user, token });
    } catch (error) {
      next(error);
    }
  })

  route.get('/add/:username', async (req, res, next) => {
    try {
      if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
      if (req.user.username == req.params.username) throw new CreateError(400, 'You can not friend yourself!');
      const recipient = await userService.getUserByUsername(req.params.username);
      if (!recipient) throw new CreateError(404, `User with Username ${req.params.username} not found.`);
      if (recipient.friends.includes(req.user._id)) throw new CreateError(404, `Already friends with user.`);
      const request = await requestService.newRequest(req.user._id, recipient._id);
      return res.status(201).json({ request });
    } catch (error) {
      next(error);
    }
  })

  route.delete('/:id', async (req, res, next) => {
    try {
      if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
      if (req.user.role != 'admin') throw new CreateError(401, 'You must be an admin to use this route.');
      const deleted = await userService.deleteUser(req.params.id);
      return res.status(201).json({ deleted });
    } catch (error) {
      next(error);
    }
  })

  route.patch('/:id', async (req, res, next) => {
    try {
      if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
      if (req.user.role != 'admin') throw new CreateError(401, 'You must be an admin to use this route.');
      const user = await userService.updateUser(req.params.id, req.user._id, req.body);
      return res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  })
};