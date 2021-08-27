const CreateError = require('http-errors');
const Server = require('../models/server');

const get = async() => {
  try {
    let serverRecords = await Server.find().populate('users', [ '_id', 'username', 'role' ]);
    return serverRecords;
  } catch(error) {
    throw new CreateError(error)
  }
}

const getServersByUserId = async(_id) => {
  try {
    let serverRecords = await Server.find({ 'members': _id }).populate('members', [ '_id', 'username', 'role' ]).populate('owner', [ '_id', 'username', 'role' ]);
    return serverRecords;
  } catch(error) {
    throw new CreateError(error)
  }
}


const create = async(owner, params) => {
  try {
    const { name } = params;
    const serverRecord = await Server.create({
      name,
      owner,
      members: [ owner ],
    })
    return serverRecord;
  } catch (error) {
    throw new CreateError(error)
  }
}

const join = async(serverID, userID) => {
  try {
    let serverRecord = await Server.findOne({ '_id': serverID });
    if (serverRecord.members.includes(userID)) throw new CreateError(401, 'You are already in this server.');
    serverRecord.members.push(userID);
    serverRecord.save();
    return serverRecord;
  } catch(error) {
    throw new CreateError(error)
  }
}

const joinByName = async(name, userID) => {
  try {
    let serverRecord = await Server.findOne({ 'name': name });
    if (serverRecord.members.includes(userID)) throw new CreateError(401, 'You are already in this server.');
    serverRecord.members.push(userID);
    serverRecord.save();
    return serverRecord;
  } catch(error) {
    throw new CreateError(error)
  }
}

exports.get = get;
exports.getServersByUserId = getServersByUserId;
exports.create = create;
exports.join = join;
exports.joinByName = joinByName;
