const routes = require('express').Router();
const auth = require('./routes/auth');
const user = require('./routes/user');

module.exports = (app) => {
  app.use('/v1', routes);

  auth(routes);
  user(routes);
  return routes;
};