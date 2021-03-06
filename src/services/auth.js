const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CreateError = require('http-errors');
const config = require('../config');
const User = require('../models/user');

function generateToken(user) {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 5);

  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      tag: user.tag,
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
    const token = generateToken(userRecord);
    return { user, token };
  } catch (error) {
    if (error.errors.email) throw new CreateError(409, 'Account already exists with this email.');
    if (error.errors.username) throw new CreateError(409, 'This username is already in use.');
    console.log(error);
    throw new CreateError(500, 'Something went wrong.');
  }
}

const login = async (userInfo) => {
  const { email, password } = userInfo;
  let userRecord = await User.findOne({ email }, '_id username tag email role friends avatar password').lean();
  if (!userRecord) throw new CreateError(404, 'User with this email not found.');
  const validPassword = await bcrypt.compare(password, userRecord.password);
  if (!validPassword) throw new CreateError(401, 'Invalid email or password.');
  const token = generateToken(userRecord);
  return token;
}

const me = async (_id) => {
  const userRecord = await User.findOne({ _id }, '_id username tag email role friends avatar').populate('friends', ['_id', 'username', 'tag', 'role', 'avatar']);
  if (!userRecord) throw new CreateError(404, 'User with this email not found.');
  return userRecord;
}

exports.login = login;
exports.register = register;
exports.me = me;
