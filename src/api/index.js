const routes = require('express').Router();
const v1 = require('./v1');

module.exports = () => {
  v1(routes);
  return routes;
};