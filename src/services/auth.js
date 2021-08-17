const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CreateError = require('http-errors');
const config = require('../config');
const User = require('../models/user');
const user = require('../models/user');

function generateToken(user) {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 5);

  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      exp: exp.getTime() / 1000,
    },
    config.secret,
  );
}

const register = async (userInfo) => {
  try {
    const { email, username } = userInfo;
    const password = await bcrypt.hash(userInfo.password, 10)
    const userRecord = await User.create({
      email,
      username,
      password,
    })
    const user = {
      _id: userRecord._id,
      email: userRecord.email,
      username: userRecord.username,
      role: userRecord.role,
    }
    const token = generateToken(user);
    return { user, token };
  } catch (error) {
    if (error.errors.email) throw new CreateError(409, 'Account already exists with this email.');
    if (error.errors.username) throw new CreateError(409, 'This username is already in use.');
    throw new CreateError(500, 'Something went wrong.');
  }
}

const login = async (userInfo) => {
    const { email, password } = userInfo;
    const userRecord = await User.findOne({ email });
    if (!userRecord) throw new CreateError(404, 'User with this email not found.');
    const validPassword = await bcrypt.compare(
      password,
      userRecord.password,
    );
    if (!validPassword) throw new CreateError(401, 'Invalid email or password.');
    const user = {
      _id: userRecord._id,
      email: userRecord.email,
      username: userRecord.username,
      role: userRecord.role,
    }
    const token = generateToken(user);
    return { user, token };
}

const me = async(userInfo) => {
  const { email } = userInfo;
  const userRecord = await User.findOne({ email });
  if (!userRecord) throw new CreateError(404, 'User with this email not found.');
  const user = {
    _id: userRecord._id,
    email: userRecord.email,
    username: userRecord.username,
    role: userRecord.role,
  }
  return user;
}

exports.login = login;
exports.register = register;
exports.me = me;
