const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
    channel: {
      type : mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    author: {
      type : mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Message', schema);