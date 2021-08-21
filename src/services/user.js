const CreateError = require('http-errors');
const jwt = require('jsonwebtoken');
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
      email: user.email,
      role: user.role,
      exp: exp.getTime() / 1000,
    },
    config.secret,
  );
}

const get = async() => {
  try {
    return await User.find();
  } catch(error) {
    throw new CreateError(error)
  }
}

const getUser = async(id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    if (error.name == 'CastError') throw new CreateError(400, `_id: ${id} is invalid format.`);
    throw new CreateError(error);   
  }
}

const deleteUser = async(id) => {
  const deleted = await User.deleteOne({ _id: id });
  if (!deleted.deletedCount) throw new CreateError(404, 'User with Id not found.');
  return ({ deleted: true, _id: id });
}

const updateUser = async(id, userInfo) => {
  try {
    const userRecord = await User.findByIdAndUpdate(id, { $set: userInfo }, { new: true });
    if (!userRecord) throw new CreateError(404, 'User with Id not found.');
    const user = {
      _id: userRecord._id,
      email: userRecord.email,
      username: userRecord.username,
      role: userRecord.role,
    }
    const token = generateToken(user);
    return { user, token };
  } catch (error) {
    if (error.name == 'CastError') throw new CreateError(400, 'Invalid Id format.')
    if (error.codeName == 'DuplicateKey') throw new CreateError(409, `Username or Email already in use.`);
    throw new CreateError(error)
  }

}

exports.get = get;
exports.getUser = getUser;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;