const dotenv = require('dotenv');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();

if (envFound.error) throw new Error(".env file not found.");

module.exports = {
  host: process.env.DB_HOST,
  port: process.env.PORT,
  secret: process.env.SECRET,
  api: {
    prefix: '/api',
  },
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
};