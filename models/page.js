/**
 * /models/page.js
 */

var mongoose = require('mongoose');

/**
 * 页面模型
 */
var PageSchema = new mongoose.Schema({
  // 标题
  title: String,
  // slug
  slug: String,
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

/**
 * 按slug得到page
 * @param  string   slug
 * @param  string   fields
 * @param  Function callback
 * @return
 */
PageSchema.static('findBySlug', function(slug, fields, callback) {
  return this.findOne({ slug: slug }, fields, null, callback);
});

/**
 * 按id更新page
 * @param  int   id
 * @param  Object   page
 * @param  Function callback
 * @return
 */
PageSchema.static('updateById', function(id, page, callback) {
  return this.findByIdAndUpdate(id, { $set: page }, callback);
});

module.exports = mongoose.model('Page', PageSchema);
