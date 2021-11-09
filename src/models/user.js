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
    username: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
      default: (Math.floor(Math.random() * 10000) + 10000).toString().substring(1)
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  { timestamps: true },
);

schema.plugin(uniqueValidator);

module.exports = mongoose.model('User', schema);