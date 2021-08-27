const expressLoader = require('./express');
const socketLoader = require('./socket');
const mongooseLoader = require('./mongoose');
const Logger = require('./logger');

module.exports = async (app, server) => {
  await mongooseLoader();
  Logger.info('Database loaded and connected!');
  expressLoader(app);
  Logger.info('Express loaded!');
  socketLoader(server);
  Logger.info('Socket loaded!');
};
