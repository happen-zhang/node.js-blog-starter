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
  // 描述
  description: String,
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

/**
 * 得到所有的友情链接
 * @param  string   fields
 * @param  Function callback
 * @return
 */
LinkSchema.static('findAll', function(fields, callback) {
  return this.find(null, fields, null, callback);
});

module.exports = mongoose.model('Link', LinkSchema);
