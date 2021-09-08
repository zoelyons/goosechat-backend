const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: 'user',
      required: true,
    },
    avatar: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    friends: [{
      type : mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  { timestamps: true },
);

schema.plugin(uniqueValidator);

module.exports = mongoose.model('User', schema);