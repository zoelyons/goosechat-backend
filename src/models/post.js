const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.ObjectId,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Post', schema);