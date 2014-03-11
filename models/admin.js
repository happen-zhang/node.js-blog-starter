/**
 * /models/admin.js
 */

var mongoose = require('mongoose');

/**
 * 管理员模型
 */
var AdminSchema = new mongoose.Schema({
  // 登录名
  loginName: String,
  // 密码
  password: String,
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

module.exports = mongoose.model('Admin', AdminSchema);
