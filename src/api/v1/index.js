const routes = require('express').Router();
const auth = require('./routes/auth');
const user = require('./routes/user');
const server = require('./routes/server');
const channel = require('./routes/channel');
const message = require('./routes/message');
const request = require('./routes/request');

module.exports = (app) => {
  app.use('/v1', routes);

  auth(routes);
  user(routes);
  server(routes);
  channel(routes);
  message(routes);
  request(routes);
  return routes;
};