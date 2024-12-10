const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String },
  createAT: {
    type: Date,
    default: Date.now()
  },
});

module.exports = mongoose.model('Comment', CommentSchema);