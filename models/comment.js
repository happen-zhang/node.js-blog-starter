/**
 * /models/comment.js
 */

var mongoose = require('mongoose');


// email正则
var emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * website验证器
 * @param  string url 需验证的url
 * @return boolean
 */
var websiteValidation = function(url) {
  if (!url) {
    return true;
  }

  var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w\- .\/?%&=]*)?/;

  return urlReg.test(url);
}

/**
 * 评论模型
 */
var CommentSchema = new mongoose.Schema({
  // 评论者
  author: {
    type: String,
    required: '{PATH} is required!'
  },
  // 邮箱
  email: {
    type: String,
    required: '{PATH} is required!',
    validate: [emailReg, '{PATH} was incorrectly formed!']
  },
  // 网站
  website: {
    type: String,
    validate: [websiteValidation, '{PATH} was incorrectly formed!']
  },
  // 内容
  content: {
    type: String,
    required: '{PATH} is required!'
  },
  // 评论者ip
  authorIp: String,
  // 是否垃圾评论
  isSpam: {
    type: Boolean,
    default: false
  },
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

module.exports = mongoose.model('Comment', CommentSchema);
