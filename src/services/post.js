const CreateError = require('http-errors');
const config = require('../config');
const Post = require('../models/post');
const user = require('../models/user');
const commentService = require('./comment');
const userService = require('./user');

const get = async() => {
  try {
    let postRecords = await Post.find().lean();
    for (var post of postRecords) {
      post = await buildPost(post);
    }
    return postRecords;
  } catch(error) {
    throw new CreateError(error)
  }
}

const buildPost = async(post) => {
  const userRecord = await userService.getUser(post.author);
  const commentRecords = await commentService.getComments(post._id);
  let comments = [];
  for (var commentRecord of commentRecords) {
    var commentOjbect = commentRecord.toObject();
    const commentAuthor = await userService.getUser(commentOjbect.author);
    commentOjbect.author = {
      _id: commentAuthor._id,
      username: commentAuthor.username,
      role: commentAuthor.role,
    };
    comments.push(commentOjbect);
  }
  post.comments = comments;
  post.author = {
    _id: userRecord._id,
    username: userRecord.username,
    role: userRecord.role,
  };
  return post
}

const getPost = async(id) => {
  try {
    const postRecord = await Post.findById(id);
    if (!postRecord) throw new CreateError(404, 'Post not found.');
    const commentRecords = await commentService.getComments(id);
    const userRecord = await userService.getUser(postRecord.author);
    let post = postRecord.toObject();
    post.comments = commentRecords;
    post.author = {
      _id: userRecord._id,
      username: userRecord.username,
      role: userRecord.role,
    };
    return post;
  } catch (error) {
    if (error.name == 'CastError') throw new CreateError(400, `_id: ${id} is invalid format.`);
    throw new CreateError(error);   
  }
}

const createPost = async(author, postInfo) => {
  try {
    const { title, content } = postInfo;
    const postRecord = await Post.create({
      title,
      content,
      author
    })
    return postRecord;
  } catch (error) {
    throw new CreateError(error)
  }
}

exports.get = get;
exports.getPost = getPost;
exports.createPost = createPost;
