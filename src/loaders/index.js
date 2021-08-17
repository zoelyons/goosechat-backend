const expressLoader = require('./express');
const mongooseLoader = require('./mongoose');
const Logger = require('./logger');

module.exports = async (app) => {
  await mongooseLoader();
  Logger.info('Database loaded and connected!');
  expressLoader(app);
  Logger.info('Express loaded!');
};
