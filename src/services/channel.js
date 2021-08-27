const CreateError = require('http-errors');
const Channel = require('../models/channel');

// const get = async() => {
//   try {
//     let serverRecords = await Server.find();
//     return serverRecords;
//   } catch(error) {
//     throw new CreateError(error)
//   }
// }
const getChannelsByServerId = async(_id) => {
  console.log(_id)
  try {
    let channelRecords = await Channel.find({ 'server': _id }).populate('members', [ '_id', 'username', 'role' ]);
    return channelRecords;
  } catch(error) {
    throw new CreateError(error)
  }
}

const getChannelsByUserId = async(_id) => {
  try {
    let channelRecords = await Channel.find({ 'members': _id }).populate('members', [ '_id', 'username', 'role' ]).populate('owner', [ '_id', 'username', 'role' ]);
    return channelRecords;
  } catch(error) {
    throw new CreateError(error)
  }
}

const create = async(author, params) => {
  try {
    const { name, description, server } = params;
    const channelRecord = await Channel.create({
      server,
      name,
      description,
      members: [ author ],
    })
    return channelRecord;
  } catch (error) {
    throw new CreateError(error)
  }
}

const join = async(serverID, userID) => {
  try {
    let channelRecords = await Channel.updateMany({ server: serverID }, { "$push": { "members": userID } })
    return channelRecords;
  } catch(error) {
    throw new CreateError(error)
  }
}

// exports.get = get;
exports.create = create;
exports.getChannelsByServerId = getChannelsByServerId;
exports.getChannelsByUserId = getChannelsByUserId;
exports.join = join;
