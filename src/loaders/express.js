const express = require('express');
const cors = require('cors');
const routes = require('../api');
const config = require('../config');

module.exports = (app) => {
  app.get('/status', (req, res) => {
    res.status(200).json({ status: 'alive' });
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  app.use(cors());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(config.api.prefix, routes());

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      error: {
        status: err.status,
        message: err.message,
      },
    });
  });
};