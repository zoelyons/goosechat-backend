const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
    postId: {
      type: mongoose.ObjectId,
      required: true,
    },
    commentId: {
      type: mongoose.ObjectId,
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

module.exports = mongoose.model('Comment', schema);