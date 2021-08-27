const express = require('express');
const config = require('./config');
const loaders = require('./loaders');

async function startServer() {
  const app = express();
  const server = require('http').createServer(app);

  loaders(app, server);

  server
    .listen(config.port, () => {})
    .on('error', () => {
      process.exit(1);
    });
}

startServer();
