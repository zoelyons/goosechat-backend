const route = require('express').Router();
const { body, validationResult } = require('express-validator');
const CreateError = require('http-errors');
const userService = require('../../../services/user');

module.exports = (app) => {
  app.use('/users', route);

  route.get('/:id?', async (req, res, next) => {
    try {
      if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
      if (req.user.role != 'admin') throw new CreateError(401, 'You must be an admin to use this route.');
      let user = null;
      if (!req.params.id) {
        user = await userService.get();
      } else {
        user = await userService.getUser(req.params.id);
      }
      return res.status(201).json({ user });
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
      const user = await userService.updateUser(req.params.id, req.body);
      return res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  })
};