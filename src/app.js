const express = require('express');
const config = require('./config');
const loaders = require('./loaders');

async function startServer() {
  const app = express();

  loaders(app);

  app
    .listen(config.port, () => {})
    .on('error', () => {
      process.exit(1);
    });
}

startServer();
