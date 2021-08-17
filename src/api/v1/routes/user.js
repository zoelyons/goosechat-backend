const route = require('express').Router();
const { body, validationResult } = require('express-validator');
const CreateError = require('http-errors');
const userService = require('../../../services/user');

module.exports = (app) => {
  app.use('/user', route);

  route.get('/', async (req, res, next) => {
    try {
      if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
      if (req.user.role != 'admin') throw new CreateError(401, 'You must be an admin to use this route.');
      const users = await userService.get();
      return res.status(201).json({ users });
    } catch (error) {
      next(error);
    }
  })
};