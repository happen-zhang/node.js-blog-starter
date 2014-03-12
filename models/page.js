/**
 * /models/page.js
 */

var mongoose = require('mongoose');

/**
 * 页面模型
 */
var PostSchema = new mongoose.Schema({
  // 标题
  title: String,
  // 内容
  content: String,
  // 创建时间
  created: {
    type: Date,
    default: Date.now
  },
  // 更新时间
  updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Page', PostSchema);
