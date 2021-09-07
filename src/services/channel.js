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
const getChannelsByServerId = async(serverID, userID) => {
  try {
    let channelRecords = await Channel.find({ 'server': serverID, 'members': userID }).populate('members', [ '_id', 'username', 'role' ]);
    return channelRecords;
  } catch(error) {
    throw new CreateError(error)
  }
}

const getChannelsByUserId = async(_id) => {
  try {
    let channelRecords = await Channel.find({ 'members': _id }).populate('members', [ '_id', 'username', 'role' ]);
    return channelRecords;
  } catch(error) {
    throw new CreateError(error)
  }
}

const getMyDirectMessageChannels = async(_id) => {
  try {
    let channelRecords = await Channel.find({ 'members': _id, 'directMessage': true }).populate('members', [ '_id', 'username', 'role' ]);
    return channelRecords;
  } catch(error) {
    throw new CreateError(error)
  }
}

const findDirectMessageChannelByIds = async(user1Id, user2Id) => {
  try {
    let channelRecord = await Channel.findOne({ 'members': [user1Id, user2Id], 'directMessage': true });
    return channelRecord;
  } catch (error) {
    console.log(error)
    throw new CreateError(error)
  }
}

const create = async(params, members) => {
  try {
    const { name, description, server } = params;
    const channelRecord = await Channel.create({
      server,
      name,
      description,
      members: members,
    })
    return channelRecord;
  } catch (error) {
    throw new CreateError(error)
  }
}

const createDirectMessageChannel = async(author, _id) => {
  try {
    let channelRecord = await Channel.create({
      directMessage: true,
      members: [author, _id],
    })
    channelRecord = await channelRecord.populate('members', [ '_id', 'username', 'role' ]).execPopulate();
    return channelRecord;
  } catch (error) {
    console.log(error);
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
exports.createDirectMessageChannel = createDirectMessageChannel;
exports.getChannelsByServerId = getChannelsByServerId;
exports.getChannelsByUserId = getChannelsByUserId;
exports.getMyDirectMessageChannels = getMyDirectMessageChannels;
exports.join = join;
exports.findDirectMessageChannelByIds = findDirectMessageChannelByIds;
