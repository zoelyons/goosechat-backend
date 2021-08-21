const routes = require('express').Router();
const auth = require('./routes/auth');
const user = require('./routes/user');
const post = require('./routes/post');
const comment = require('./routes/comment');

module.exports = (app) => {
  app.use('/v1', routes);

  auth(routes);
  user(routes);
  post(routes);
  comment(routes);
  return routes;
};