const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
    server: {
      type : mongoose.ObjectId,
      ref: 'Server',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    members: [{
      type : mongoose.ObjectId,
      ref: 'User',
    }],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Channel', schema);