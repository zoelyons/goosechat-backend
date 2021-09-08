const CreateError = require('http-errors');
const config = require('../config');
const Request = require('../models/request');

const newRequest = async (sender, recipient) => {
  try {
    let requestRecord = await Request.create({
      sender,
      recipient,
    })
    requestRecord = await requestRecord.populate('sender', ['_id', 'username', 'role']).execPopulate();
    return requestRecord;
  } catch (error) {
    throw new CreateError(error)
  }
}

const getRequestByUserIds = async (_id, recipientId, onlyActive) => {
  let params = {
    'sender': _id,
    'recipient': recipientId,
  }
  if (onlyActive) {
    params.accepted = false;
    params.declined = false;
  }
  try {
    let requestRecords = await Request.findOne(params);
    return requestRecords;
  } catch (error) {
    throw new CreateError(error)
  }
}

const getRequestsByUserId = async (_id, onlyActive) => {
  let params = {
    'recipient': _id,
  }
  if (onlyActive) {
    params.accepted = false;
    params.declined = false;
  }
  try {
    let requestRecords = await Request.find(params).populate('sender', ['_id', 'username', 'role']);
    return requestRecords;
  } catch (error) {
    throw new CreateError(error)
  }
}

const getRequestById = async (_id) => {
  try {
    let requestRecord = await Request.findOne({ _id });
    return requestRecord;
  } catch (error) {
    throw new CreateError(error)
  }
}

const updateRequest = async (_id, userId, params) => {
  try {
    let requestRecord = await Request.findOne({ _id });
    if (requestRecord.recipient != userId) throw new CreateError('401', 'Not your request.');
    let { accepted, declined } = params;
    if (accepted) requestRecord.accepted = true;
    if (declined) requestRecord.declined = true;
    requestRecord.save();
    return requestRecord;
  } catch (error) {
    throw new CreateError(error)
  }
}


exports.newRequest = newRequest;
exports.getRequestsByUserId = getRequestsByUserId;
exports.getRequestById = getRequestById;
exports.updateRequest = updateRequest;
exports.getRequestByUserIds = getRequestByUserIds;