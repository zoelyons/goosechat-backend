const route = require('express').Router();
const authService = require('../../../services/auth');

module.exports = (app) => {
  app.use('/auth', route);

  route.get('/', async (req, res, next) => {
    res.send({ message: { status: 'live' } });
  })

  route.post('/register', async (req, res, next) => {
    try {
      user = await authService.register(req.body);
      return res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  });
};