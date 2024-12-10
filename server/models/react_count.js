const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  writer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: { type: Number, default: 0 }, // Track the number of likes
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Like', LikeSchema);