const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = mongoose.Schema(
  {
    owner: {
      type : mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    private: {
      type: Boolean,
      required: true,
      default: false,
    },
    members: [{
      type : mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  { timestamps: true },
);

schema.plugin(uniqueValidator);

module.exports = mongoose.model('Server', schema);