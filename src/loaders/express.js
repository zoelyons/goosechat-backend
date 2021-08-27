const express = require('express');
const jwt = require('jsonwebtoken');
const CreateError = require('http-errors');
const cors = require('cors');
const routes = require('../api');
const config = require('../config');

const authenticator = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    req.authenticated = false;
    next();
    return;
  }
  try {
    const decoded = jwt.verify(token, config.secret);
    if (decoded) {
      req.authenticated = true;
      req.user = decoded;
      next();
    }
  } catch (error) {
    next(CreateError(error.status, error.message));
  }
};

module.exports = (app, server) => {
  app.use(cors());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(authenticator);
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