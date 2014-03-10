/**
 * /models/tag.js
 */

var mongoose = require('mongoose');

/**
 * 标签模型
 */
var TagSchema = new mongoose.Schema({
  // 名称
  name: String,
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

module.exports = mongoose.model('Tag', TagSchema);
