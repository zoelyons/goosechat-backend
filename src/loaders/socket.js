const { Server } =  require('socket.io');
const sockets = require('../sockets');
const jwt = require('jsonwebtoken');
const CreateError = require('http-errors');
const config = require('../config');

const authenticator = async (socket, next) => {
  const token = socket.handshake.query.token;

  if (!token) {
    socket.authenticated = false;
    next();
    return;
  }
  
  try {
    const decoded = jwt.verify(token, config.secret);
    if (decoded) {
      socket.authenticated = true;
      socket.user = decoded;
      next();
    }
  } catch (error) {
    next(CreateError(error.status, error.message));
  }
};

module.exports = (server) => { 
  const io = new Server(server, { 
    allowEIO3: true,
    cors: {
    origin: true,
    credentials: true
    }
  });

  io.use(authenticator);
  io.listen;

  sockets(io);
};
