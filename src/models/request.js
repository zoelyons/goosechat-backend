const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
    sender: {
      type : mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type : mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accepted: {
      type: Boolean,
      required: true,
      default: false,
    },
    declined: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Request', schema);