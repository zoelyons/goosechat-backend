const routes = require('express').Router();
const auth = require('./routes/auth');

module.exports = (app) => {
  app.use('/v1', routes);

  auth(routes);
  return routes;
};