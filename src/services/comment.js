const CreateError = require('http-errors');
const Comment = require('../models/comment');
const postService = require('./post');

const get = async() => {
  try {
    return await Comment.find();
  } catch(error) {
    throw new CreateError(error)
  }
}

const getComment = async(id) => {
  try {
    const comment = await Comment.findById(id);
    return comment;
  } catch (error) {
    if (error.name == 'CastError') throw new CreateError(400, `_id: ${id} is invalid format.`);
    throw new CreateError(error);   
  }
}

const getComments = async(postId) => {
  try {
    const commentRecords = await Comment.find({ postId });
    if (!commentRecords) throw new CreateError(404, 'comments for PostId not found.');
    return commentRecords;
  } catch (error) {
    if (error.name == 'CastError') throw new CreateError(400, `_id: ${id} is invalid format.`);
    throw new CreateError(error);   
  }
}

const createComment = async(author, commentInfo) => {
  try {
    const { content, postId, commentId } = commentInfo;
    const postRecord = await postService.getPost(postId);
    if (!postRecord) throw new CreateError(404, 'PostId not found.');
    const commentRecord = await Comment.create({
      postId,
      commentId,
      content,
      author: author._id,
    })
    const comment = commentRecord.toObject();
    comment.author = {
      _id: author._id,
      username: author.username,
      role: author.role,
    }
    return comment;
  } catch (error) {
    throw new CreateError(error)
  }
}

exports.get = get;
exports.getComment = getComment;
exports.getComments = getComments;
exports.createComment = createComment;
