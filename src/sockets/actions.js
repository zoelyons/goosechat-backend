const authService = require('../services/auth');
const userService = require('../services/user');
const requestService = require('../services/request');
const user = require('../models/user');


function test(socket, data) {
  data.number++;
  return data;
}

const me = async (socket) => {
  try {
    const userRecord = await authService.me(socket.user._id);
    return { user: userRecord };
  } catch (error) {
    return error;
  }
}

// route.get('/me', async (req, res, next) => {
//   try {
//     if (!req.authenticated) throw new CreateError(401, 'You must be authenticated to use this route.');
//     const user = await authService.me(req.user._id);
//     return res.status(201).json({ user });
//   } catch (error) {
//     next(error);
//   }
// })

exports.test = test;
exports.me = me;
