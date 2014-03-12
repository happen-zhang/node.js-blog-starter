/**
 * /models/post.js
 */

var mongoose = require('mongoose');

var Comment = require('./comment');
var Tag = require('./tag');

/**
 * 文章模型
 */
var PostSchema = new mongoose.Schema({
  // 标题
  title: String,
  // slugify
  slug: String,
  // 内容
  content: String,
  // 评论
  comments: [Comment.schema],
  // 标签
  tags: [Tag.schema],
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
 * briefContent
 * @return string
 */
PostSchema.virtual('briefContent').get(function() {
  var more = this.content.indexOf('<!--more-->');
  if (more > 0) {
    return this.content.substr(0, more);
  }

  return '';
});

/**
 * 得到post数据
 * @param  int   skip
 * @param  int   limit
 * @param  string   fields
 * @param  Function callback
 * @return
 */
PostSchema.static('findAll', function(skip, limit, fields, callback) {
  var options = {
    skip: skip,
    limit: limit,
    sort: {
      created: -1,
      _id: -1
    }
  };

  return this.find(null, fields, options, callback);
});

/**
 * 按slug得到post
 * @param  string   slug
 * @param  string   fields
 * @param  Function callback
 * @return
 */
PostSchema.static('findBySlug', function(slug, fields, callback) {
  return this.findOne({ slug: slug }, fields, null, callback);
});

/**
 * 按tag得到post
 * @param  string   tag
 * @param  string   fields
 * @param  Function callback
 * @return
 */
PostSchema.static('findByTag', function(tag, fields, callback) {
  return this.find({ 'tags.name': tag }, fields, null, callback);
});

/**
 * 按id更新post
 * @param  int   id
 * @param  Object   post
 * @param  Function callback
 * @return
 */
PostSchema.static('updateById', function(id, post, callback) {
  return this.findByIdAndUpdate(id, { $set: post }, callback);
});

/**
 * 添加评论到指定id的post
 * @param  int   id
 * @param  Comment   comment
 * @param  Function callback
 * @return
 */
PostSchema.static('addCommentById', function(id, comment, callback) {
  return this.update({ _id: id }, { $push: { comments: comment } }, callback);
});

/**
 * 删除指定id post中的指定commentId的评论
 * @param  int   id
 * @param  int   commentId
 * @param  Function callback
 * @return
 */
PostSchema.static('deleteCommentById', function(id, commentId, callback) {
  var pull = { comments: { _id: commentId } };
  return this.findByIdAndUpdate(id, { $pull: pull }, callback);
});

/**
 * spam/unspam
 * @param  string   commentId
 * @param  Boolean  isSpam
 * @param  Function cb
 * @return
 */
PostSchema.static('spamCommentById', function(commentId, isSpam, cb) {
  var set = { 'comments.$.isSpam': isSpam };

  return this.update({ 'comments._id': commentId }, { $set: set }, cb);
});

module.exports = mongoose.model('Post', PostSchema);
