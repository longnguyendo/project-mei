const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({

  likes: { type: Number, default: 0 },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Like', LikeSchema);