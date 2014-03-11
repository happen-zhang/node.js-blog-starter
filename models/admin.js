/**
 * /models/admin.js
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// salt factor
var SALT_WORK_FACTOR = 10;

/**
 * 管理员模型
 */
var AdminSchema = new mongoose.Schema({
  // 登录名
  loginname: {
    type: String,
    required: '{PATH} is required!',
    index: {
      unique: true
    }
  },
  // 密码
  password: {
    type: String,
    required: '{PATH} is required!'
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

/**
 * when pre save do this operation
 * @param  Function next
 * @return
 */
AdminSchema.pre('save', function(next) {
  var admin = this;

  // 如果password被修改过，则需要重新hash
  if (!admin.isModified('password')) {
    return next();
  }

  // 生成salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }

    // 生成hash
    bcrypt.hash(admin.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }

      admin.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model('Admin', AdminSchema);
