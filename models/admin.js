/**
 * /models/admin.js
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var adminConfig = require('../config').adminConfig;

// salt factor
var SALT_WORK_FACTOR = 10;
// 最大试图登陆次数
var MAX_LOGIN_ATTEMPTS = adminConfig.maxAttempts;
// 登陆锁时间
var LOCK_TIME = adminConfig.lockedExpire;

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
  // login locks
  loginAttempts: {
    type: Number,
    require: true,
    default: 0
  },
  // lock until
  lockUntil: {
    type: Number
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
 * virtual field：检查当前状态是否为locked
 */
AdminSchema.virtual('isLocked').get(function() {
  return (this.lockUntil && this.lockUntil > Date.now());
});

/**
 * 登陆失败状态值
 */
var reasons = AdminSchema.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAX_ATTEMPTS: 2
};

/**
 * 当执行save操作时，它将会被先执行
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

/**
 * 按loginname得到admin
 * @param  string   loginname
 * @param  Function callback
 * @return
 */
AdminSchema.static('findByLoginname', function(loginname, callback) {
  return this.findOne({ loginname: loginname }, callback);
});

/**
 * 验证登陆
 * @param  string   loginname
 * @param  string   password
 * @param  Function cb
 * @return
 */
AdminSchema.static('getAuthenticated', function(loginname, password, cb) {
  this.findOne({ loginname: loginname }, function(err, admin) {
    if (err) {
      return cb(err);
    }

    // loginname不存在
    if (null === admin) {
      return cb(null, null, reasons.NOT_FOUND);
    }

    // 当前状态是否为locked
    if (admin.isLocked) {
      return admin.incLoginAttempts(function(err) {
        if (err) {
          return cb(err);
        }

        return cb(null, null, reasons.MAX_LOGIN_ATTEMPTS);
      });
    }

    // 检查password是否正确
    admin.comparePassword(password, function(err, isMatch) {
      if (err) {
        return cb(err);
      }

      if (isMatch) {
        if (!admin.loginAttempts && !admin.lockUntil) {
          return cb(null, admin);
        }

        // 重新更新locked状态
        var updates = {
          $set: { loginAttempts: 0 },
          $unset: { lockUntil: 1 }
        };

        return admin.update(updates, function(err) {
          if (err) {
            return cb(err);
          }

          return cb(null, admin);
        });
      }

      // password错误
      admin.incLoginAttempts(function(err) {
        if (err) {
          return cb(err);
        }

        return cb(null, null, reasons.PASSWORD_INCORRECT);
      });
    });
  });
});

/**
 * 检查password
 * @param  string   candidatePassword
 * @param  Function callback
 * @return
 */
AdminSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }

    callback(null, isMatch);
  });
};

/**
 * 增加attempts
 * @param  Function callback
 * @return
 */
AdminSchema.methods.incLoginAttempts = function(callback) {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    // 之前没被locked或者之前的locked已过期
    return this.update({
      // 设置loginAttempts为1
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    }, callback);
  }

  var updates = { $inc: { loginAttempts: 1 } };

  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    // locked
    updates.$set = { lockUntil: Date.now() + LOCK_TIME };
  }

  return this.update(updates, callback);
}

module.exports = mongoose.model('Admin', AdminSchema);
