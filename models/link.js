/**
 * /models/link.js
 */

var mongoose = require('mongoose');

/**
 * 友情链接模型
 */

var LinkSchema = new mongoose.Schema({
  // 名称
  name: String,
  // url
  url: String,
  // 创建时间
  created: { type: Date, default: Date.now },
  // 更新时间
  updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Link', LinkSchema);
