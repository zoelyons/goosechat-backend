const CreateError = require('http-errors');
const Message = require('../models/message');

const getMessagesByChannelId = async(id) => {
  try {
    const messageRecords = await Message.find({ channel: id }).populate('author', [ '_id', 'username', 'role' ]);
    return messageRecords;
  } catch (error) {
    throw new CreateError(error);   
  }
}

const create = async(author, params) => {
  try {
    const { message, channel } = params;
    let messageRecord = await Message.create({
      message,
      author,
      channel
    });
    messageRecord = await messageRecord.populate('author', [ '_id', 'username', 'role' ]).execPopulate()
    return messageRecord;
  } catch (error) {
    throw new CreateError(error)
  }
}

exports.getMessagesByChannelId = getMessagesByChannelId;
exports.create = create;
