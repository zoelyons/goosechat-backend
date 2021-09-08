const route = require('express').Router();
const { body, validationResult } = require('express-validator');
const CreateError = require('http-errors');
const authService = require('../../../services/auth');

module.exports = (app) => {
  app.use('/auth', route);

  route.get('/', async (req, res, next) => {
    res.send({ message: { status: 'live' } });
  })

  route.get('/me', async (req, res, next) => {
    try {
      if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
      const user = await authService.me(req.user._id);
      return res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  })

  route.post(
    '/register',
    body('email').not().isEmpty().withMessage('Email must not be blank.').isEmail().withMessage('Email must be email format.'),
    body('username').not().isEmpty().withMessage('Username must not be blank.'),
    body('password').not().isEmpty().withMessage('Password must not be blank.'),
    async (req, res, next) => {
      try {
        if (req.authenticated) throw new CreateError(401, 'You must be logged out to use this route.');
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new CreateError(400, errors.array()[0].msg);
        const { user, token } = await authService.register(req.body);
        return res.status(201).json({ user, token });
      } catch (error) {
        next(error);
      }
    });

  route.post(
    '/login',
    body('email').not().isEmpty().withMessage('Email must not be blank.').isEmail().withMessage('Email must be email format.'),
    body('password').not().isEmpty().withMessage('Password must not be blank.'),
    async (req, res, next) => {
      try {
        if (req.authenticated) return res.status(201).json({ user: req.user, token: req.headers.authorization });
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new CreateError(400, errors.array()[0].msg);
        const token = await authService.login(req.body);
        return res.status(201).json({ token });
      } catch (error) {
        next(error);
      }
    });
};