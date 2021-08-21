const route = require('express').Router();
const { body, validationResult } = require('express-validator');
const CreateError = require('http-errors');
const commentService = require('../../../services/comment');

module.exports = (app) => {
  app.use('/comments', route);

  route.get('/:id?', async (req, res, next) => {
    try {
      if (!req.params.id) {
        comment = { posts: await commentService.get() }
      } else {
        comment =  { post: await commentService.getComment(req.params.id) }
      }
      return res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  })

  route.post('/', async (req, res, next) => {
    try {
      if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
      const comment = await commentService.createComment(req.user, req.body);
      return res.status(201).json({ comment });
    } catch (error) {
      next(error);
    }
  })
};