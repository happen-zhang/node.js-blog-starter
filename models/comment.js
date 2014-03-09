/**
 * /models/comment.js
 */

var mongoose = require('mongoose');

/**
 * 评论模型
 */

var CommentSchema = new mongoose.Schema({
  // 评论者
  author: String,
  // 邮箱
  email: String,
  // 网站
  website: String,
  // 内容
  content: String,
  // 创建时间
  created: { type: Date, default: Date.now },
  // 更新时间
  updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);
