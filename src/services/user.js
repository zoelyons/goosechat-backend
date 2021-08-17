const CreateError = require('http-errors');
const config = require('../config');
const User = require('../models/user');

const get = async() => {
  return await User.find();
}

exports.get = get;