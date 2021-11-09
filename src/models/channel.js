const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
    server: {
      type: mongoose.ObjectId,
      ref: 'Server',
      required: false,
    },
    author: {
      type: mongoose.ObjectId,
      ref: 'User',
      required: true,
    },
    directMessage: {
      type: Boolean,
      required: true,
      default: false,
    },
    name: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    members: [{
      type: mongoose.ObjectId,
      ref: 'User',
    }],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Channel', schema);