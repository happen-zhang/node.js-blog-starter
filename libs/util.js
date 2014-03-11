/**
 * /libs/util.js
 */

var crypto = require('crypto');

/**
 * 生成mongodb url
 * @param  Object config
 * @return string
 */
exports.generateMongoUrl = function(config) {
  host = (config.host || 'localhost');
  port = (config.port || 27017);
  dbName = (config.name || 'test');

  var target = host + ':' + port + '/' + dbName;
  var user = '';
  if (config.username && config.password) {
    user += config.username + ':' + config.password + '@';
  }

  return 'mongodb://' + user + target;
};

/**
 * 生成token值
 * @return string
 */
exports.generateToken = function() {
  var currentDate = (new Date()).valueOf().toString();
  var random = Math.random().toString();

  return crypto.createHash('sha1').update(currentDate + random).digest('hex');
};

/**
 * md5加密
 * @param  string src
 * @return string desc
 */
exports.md5 = function md5(src) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(src);
  src = md5sum.digest('hex');
  return src;
};
