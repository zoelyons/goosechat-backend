const route = require('express').Router();
const { body, validationResult } = require('express-validator');
const CreateError = require('http-errors');
const postService = require('../../../services/post');

module.exports = (app) => {
  app.use('/posts', route);

  route.get('/:id?', async (req, res, next) => {
    try {
      if (!req.params.id) {
        post = { posts: await postService.get() }
      } else {
        post =  { post: await postService.getPost(req.params.id) }
      }
      return res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  })

  route.post('/', async (req, res, next) => {
    try {
      if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
      const post = await postService.createPost(req.user._id, req.body);
      return res.status(201).json({ post });
    } catch (error) {
      next(error);
    }
  })
};