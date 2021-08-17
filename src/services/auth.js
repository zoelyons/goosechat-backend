const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');

const register = async (user) => {
  try {
    const { email, username } = user;
    const password = await bcrypt.hash(user.password, 10)
    const userRecord = await User.create({
      email,
      username,
      password,
    })
    return userRecord;
  } catch (error) {
    return (error);
  }
}

exports.register = register;